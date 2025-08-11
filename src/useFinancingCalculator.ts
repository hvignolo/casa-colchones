import { useMemo } from 'react';

// Constantes de tasas y comisiones
const VAT = 21.0;
const viumiCommissions: Record<number, number> = { 2: 5.19, 5: 4.59, 10: 3.49, 20: 2.05, 40: 0.0 };
const viumiFinance: Record<number, number> = { 1: 0.0, 2: 0.0, 3: 12.66, 4: 0.0, 5: 0.0, 6: 21.01, 7: 0.0, 8: 0.0, 9: 29.28, 10: 0.0, 11: 0.0, 12: 35.79 };
const mipymeFinance: Record<number, number> = { 3: 5.93, 6: 11.24 };
const viumiMacroPromo: Record<number, Record<number, number>> = {
  3: { 2: 9.50, 5: 9.03, 10: 8.17, 20: 7.05, 40: 5.45 },
  6: { 2: 12.50, 5: 12.18, 10: 11.66, 20: 10.60, 40: 8.48 },
  9: { 2: 15.60, 5: 15.32, 10: 14.79, 20: 13.73, 40: 11.62 },
  12: { 2: 18.60, 5: 18.33, 10: 17.81, 20: 16.75, 40: 14.63 }
};
const naranjaCommissions: Record<number, number> = { 2: 5.79, 5: 3.39, 10: 3.39, 20: 0.0, 40: 0.0 };
const naranjaFinance: Record<number, number> = { 1: 0.0, 2: 0.0, 3: 10.39, 4: 0.0, 5: 0.0, 6: 17.69, 7: 0.0, 8: 0.0, 9: 23.52, 10: 0.0, 11: 0.0, 12: 29.08 };
const paywayCommission = 1.8;
const paywayCoeffNoVAT: Record<number, number> = { 2: 1.1062, 3: 1.1449, 4: 1.1844, 5: 1.2248, 6: 1.2660, 7: 0.0, 8: 0.0, 9: 1.4141, 10: 0.0, 11: 0.0, 12: 1.5575 };

interface FinancingParams {
  amount: number;
  cardType: string;
  installments: number;
  settlement: number;
  useMacroPromo: boolean;
  useMiPyMe: boolean;
}

interface FinancingResult {
  installmentValue: number;
  totalAmount: number;
  provider: string;
  commissionRate: number;
  financeRate: number;
}

export const useFinancingCalculator = (params: FinancingParams): FinancingResult => {
  const { amount, cardType, installments, settlement, useMacroPromo, useMiPyMe } = params;

  return useMemo(() => {
    if (installments === 1) {
      return {
        installmentValue: amount,
        totalAmount: amount,
        provider: 'Contado',
        commissionRate: 0,
        financeRate: 0
      };
    }

    let provider = '';
    let comRate = 0;
    let finRate = 0;

    // Funciones para calcular comisiones y financiación
    const computeViumi = (sett: number, inst: number): { com: number; fin: number } => {
      let com = viumiCommissions[sett] || 0;
      let fin = 0;
      if (useMacroPromo && inst >= 3 && viumiMacroPromo[inst]) {
        com = viumiMacroPromo[inst][sett];
        fin = 0;
      } else if (useMiPyMe && (inst === 3 || inst === 6)) {
        fin = mipymeFinance[inst] || 0;
      } else {
        fin = viumiFinance[inst] || 0;
      }
      return { com, fin };
    };

    const computeNaranja = (sett: number, inst: number): { com: number; fin: number } => {
      let com = naranjaCommissions[sett] || 0;
      let fin = 0;
      if (useMiPyMe && (inst === 3 || inst === 6)) {
        fin = mipymeFinance[inst] || 0;
      } else {
        fin = naranjaFinance[inst] || 0;
      }
      return { com, fin };
    };

    const computePayway = (sett: number, inst: number): { com: number; fin: number } => {
      let com = paywayCommission;
      let fin = 0;
      if (useMiPyMe && (inst === 3 || inst === 6)) {
        fin = mipymeFinance[inst] || 0;
      } else {
        if (inst === 1) {
          fin = 0;
        } else {
          const coeff = paywayCoeffNoVAT[inst] || 0;
          fin = coeff > 0 ? (coeff - 1) * 100 - paywayCommission : 0;
        }
      }
      return { com, fin };
    };

    if (cardType === 'viumi') {
      provider = 'Banco Macro (viüMi)';
      const { com, fin } = computeViumi(settlement, installments);
      comRate = com;
      finRate = fin;
    } else if (cardType === 'naranja') {
      provider = 'Tarjeta Naranja';
      const { com, fin } = computeNaranja(settlement, installments);
      comRate = com;
      finRate = fin;
    } else if (cardType === 'payway') {
      provider = 'Banco de Corrientes (Payway)';
      const { com, fin } = computePayway(settlement, installments);
      comRate = com;
      finRate = fin;
    } else if (cardType === 'best') {
      // Seleccionar el proveedor con menor tasa total
      const providers = [
        { name: 'Banco Macro (viüMi)', ...computeViumi(settlement, installments) },
        { name: 'Tarjeta Naranja', ...computeNaranja(settlement, installments) },
        { name: 'Banco de Corrientes (Payway)', ...computePayway(settlement, installments) }
      ];
      
      let best = providers[0];
      let bestRate = providers[0].com + providers[0].fin;
      for (const p of providers) {
        const rate = p.com + p.fin;
        if (rate > 0 && rate < bestRate) {
          best = p;
          bestRate = rate;
        }
      }
      provider = best.name;
      comRate = best.com;
      finRate = best.fin;
    }

    const totalRateEx = comRate + finRate;
    const totalRate = totalRateEx * (1 + VAT / 100);
    const gross = amount / (1 - totalRate / 100);
    const installmentValue = gross / installments;

    return {
      installmentValue,
      totalAmount: gross,
      provider,
      commissionRate: comRate,
      financeRate: finRate
    };
  }, [amount, cardType, installments, settlement, useMacroPromo, useMiPyMe]);
};

// Función auxiliar para calcular el precio de 12 cuotas para cartola
export const calculateTwelveInstallmentsPrice = (amount: number): number => {
  const settlement = 10;
  const installments = 12;
  
  // Usar Banco Macro sin promoción como referencia
  const com = viumiCommissions[settlement] || 0;
  const fin = viumiFinance[installments] || 0;
  const totalRateEx = com + fin;
  const totalRate = totalRateEx * (1 + VAT / 100);
  const gross = amount / (1 - totalRate / 100);
  
  return gross;
};