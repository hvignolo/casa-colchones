import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';

interface CalculatorPreloadData {
  amount: number;
  cardType: string;
  installments: number;
  settlement: number;
  useMacro: boolean;
  useMiPyMe: boolean;
}

interface PaymentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  preloadData?: CalculatorPreloadData;
}

/**
 * Modal para calcular el monto a cobrar en función de distintas tarjetas,
 * cantidad de cuotas y opciones de financiación. Basado en la lógica de
 * viüMi Calculator, pero implementado en React.
 * Ahora soporta datos precargados desde otros componentes.
 */
const PaymentCalculatorModal: React.FC<PaymentCalculatorModalProps> = ({ 
  isOpen, 
  onClose,
  preloadData
}) => {
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

  // Estado del formulario - valor crudo sin formatear para lógica interna
  const [rawValue, setRawValue] = useState<string>('');
  const [cardType, setCardType] = useState<string>('viumi');
  const [installments, setInstallments] = useState<number>(1);
  const [settlement, setSettlement] = useState<number>(2);
  const [useMacro, setUseMacro] = useState<boolean>(false);
  const [useMiPyMe, setUseMiPyMe] = useState<boolean>(false);
  const [result, setResult] = useState<null | {
    provider: string;
    gross: number;
    installmentValue: number;
    commissionRate: number;
    financeRate: number;
  }>(null);

  // Generar IDs únicos para el formulario
  const formIds = {
    amount: `calc-amount-${Math.random().toString(36).substr(2, 9)}`,
    cardType: `calc-card-type-${Math.random().toString(36).substr(2, 9)}`,
    installments: `calc-installments-${Math.random().toString(36).substr(2, 9)}`,
    settlement: `calc-settlement-${Math.random().toString(36).substr(2, 9)}`,
    useMacro: `calc-use-macro-${Math.random().toString(36).substr(2, 9)}`,
    useMiPyMe: `calc-use-mipyme-${Math.random().toString(36).substr(2, 9)}`,
  };

  // Efecto para cargar datos precargados
  useEffect(() => {
    if (preloadData && isOpen) {
      // Formatear el monto para el input
      const formattedAmount = preloadData.amount.toString().replace('.', ',');
      setRawValue(formattedAmount);
      setCardType(preloadData.cardType);
      setInstallments(preloadData.installments);
      setSettlement(preloadData.settlement);
      setUseMacro(preloadData.useMacro);
      setUseMiPyMe(preloadData.useMiPyMe);
      
      // Calcular automáticamente
      setTimeout(() => {
        handleCalculateWithData(preloadData);
      }, 100);
    }
  }, [preloadData, isOpen]); // handleCalculateWithData is stable

  // Formatear valor para mostrar en el input
  const formatInputValue = (value: string): string => {
    if (!value) return '';
    
    // Si hay coma, dividir en parte entera y decimal
    if (value.includes(',')) {
      const [integerPart, decimalPart] = value.split(',');
      const formattedInteger = parseInt(integerPart || '0', 10).toLocaleString('es-AR');
      return `${formattedInteger},${decimalPart}`;
    } else {
      // Solo parte entera
      const integerValue = parseInt(value, 10);
      return integerValue.toLocaleString('es-AR');
    }
  };

  // Manejar input con formateo en tiempo real
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursorPosition = e.target.selectionStart || 0;
    let value = e.target.value;
    
    // Remover todo formateo existente para obtener solo los dígitos y coma
    value = value.replace(/[^0-9,]/g, '');
    
    // Solo permitir una coma
    const commaCount = (value.match(/,/g) || []).length;
    if (commaCount > 1) {
      const firstCommaIndex = value.indexOf(',');
      value = value.substring(0, firstCommaIndex + 1) + value.substring(firstCommaIndex + 1).replace(/,/g, '');
    }
    
    // Limitar decimales a 2 dígitos
    if (value.includes(',')) {
      const [integerPart, decimalPart] = value.split(',');
      if (decimalPart && decimalPart.length > 2) {
        value = `${integerPart},${decimalPart.substring(0, 2)}`;
      }
    }
    
    // Evitar múltiples ceros al inicio
    if (value.length > 1 && value.startsWith('0') && value[1] !== ',') {
      value = value.substring(1);
    }
    
    // Guardar valor crudo para cálculos
    setRawValue(value);
    
    // Aplicar formateo para mostrar en el input
    const formattedValue = value ? formatInputValue(value) : '';
    
    // Actualizar el input con valor formateado
    setTimeout(() => {
      if (e.target) {
        e.target.value = formattedValue;
        
        // Ajustar posición del cursor considerando el formateo
        const originalLength = value.length;
        const formattedLength = formattedValue.length;
        const offset = formattedLength - originalLength;
        const newPosition = Math.min(cursorPosition + offset, formattedLength);
        e.target.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Funciones para calcular comisiones y financiación por proveedor
  const computeViumi = (sett: number, inst: number): { com: number; fin: number } => {
    let com = viumiCommissions[sett] || 0;
    let fin = 0;
    if (useMacro && inst >= 3 && viumiMacroPromo[inst]) {
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

  // Obtener tasa total (comisión + financiación) para una opción concreta
  const getRateFor = (card: string, inst: number, sett: number): number => {
    if (inst === 1) return 0;
    let pair;
    if (card === 'viumi') pair = computeViumi(sett, inst);
    else if (card === 'naranja') pair = computeNaranja(sett, inst);
    else if (card === 'payway') pair = computePayway(sett, inst);
    else {
      // Otro: obtener la menor suma de tasas entre proveedores
      const vi = computeViumi(sett, inst);
      const na = computeNaranja(sett, inst);
      const pa = computePayway(sett, inst);
      const rates = [vi.com + vi.fin, na.com + na.fin, pa.com + pa.fin].filter((x) => x > 0);
      return rates.length > 0 ? Math.min(...rates) : 0;
    }
    return (pair?.com || 0) + (pair?.fin || 0);
  };

  // Opciones de cuotas limitadas a las que ofreces: 1, 3, 6, 9, 12
  const availableInstallments = useMemo(() => {
    const allowedInstallments = [1, 3, 6, 9, 12];
    const possibilities: number[] = [];
    
    allowedInstallments.forEach((n) => {
      const rate = getRateFor(cardType, n, settlement);
      if (n === 1 || rate > 0) {
        possibilities.push(n);
      }
    });
    
    return possibilities;
  }, [cardType, settlement, useMacro, useMiPyMe]); // getRateFor is stable

  // Ajustar la selección actual si no está entre las opciones disponibles
  useEffect(() => {
    if (!availableInstallments.includes(installments)) {
      setInstallments(availableInstallments[0] || 1);
    }
  }, [availableInstallments, installments]);

  // Función auxiliar para calcular con datos específicos
  const handleCalculateWithData = (data: CalculatorPreloadData) => {
    const amount = data.amount;
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    let provider = '';
    let comRate = 0;
    let finRate = 0;
    if (data.cardType === 'viumi') {
      provider = 'Banco Macro (viüMi)';
      const { com, fin } = computeViumi(data.settlement, data.installments);
      comRate = com;
      finRate = fin;
    } else if (data.cardType === 'naranja') {
      provider = 'Tarjeta Naranja';
      const { com, fin } = computeNaranja(data.settlement, data.installments);
      comRate = com;
      finRate = fin;
    } else if (data.cardType === 'payway') {
      provider = 'Banco de Corrientes (Payway)';
      const { com, fin } = computePayway(data.settlement, data.installments);
      comRate = com;
      finRate = fin;
    } else {
      // Seleccionar el proveedor con menor monto total
      const providers = [
        { name: 'Banco Macro (viüMi)', ...computeViumi(data.settlement, data.installments) },
        { name: 'Tarjeta Naranja', ...computeNaranja(data.settlement, data.installments) },
        { name: 'Banco de Corrientes (Payway)', ...computePayway(data.settlement, data.installments) }
      ];
      // Calcular la suma de tasas (sin IVA) y elegir la menor >0
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
    // Calcular total
    const totalRateEx = comRate + finRate;
    const totalRate = totalRateEx * (1 + VAT / 100);
    const gross = amount / (1 - totalRate / 100);
    const installmentValue = gross / data.installments;
    setResult({
      provider,
      gross,
      installmentValue,
      commissionRate: comRate,
      financeRate: finRate
    });
  };

  // Calcular monto a cobrar y valor de cuota
  const handleCalculate = () => {
    // Convertir el valor crudo a número
    const amount = parseFloat(rawValue.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }
    
    const data: CalculatorPreloadData = {
      amount,
      cardType,
      installments,
      settlement,
      useMacro,
      useMiPyMe
    };
    
    handleCalculateWithData(data);
  };

  // Formatear moneda a formato ARS con separador de miles y coma decimal
  const formatCurrency = (val: number) => {
    return val.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    });
  };

  // Determinar si el monto es válido (> 0) para habilitar el botón
  const parsedAmount = parseFloat(rawValue.replace(',', '.'));
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;

  // No renderizar nada si el modal no está abierto
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 sm:w-10/12 max-w-3xl max-h-[90vh] flex flex-col overflow-hidden mx-4">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-b">
          <h3 className="text-lg sm:text-xl font-semibold">Calculadora de cuotas</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Formulario */}
          <div className="bg-gray-50 p-4 rounded-lg shadow space-y-4">
            <div className="flex flex-col">
              <label htmlFor={formIds.amount} className="text-sm font-medium mb-2">Monto neto a recibir (ARS)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  id={formIds.amount}
                  name="amount"
                  inputMode="decimal"
                  onChange={handleInputChange}
                  placeholder="0"
                  className="border rounded-md p-2 pl-8 w-full text-lg font-mono"
                  autoComplete="off"
                  defaultValue={preloadData ? formatInputValue(preloadData.amount.toString().replace('.', ',')) : ''}
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor={formIds.cardType} className="text-sm font-medium">Tarjeta</label>
              <select
                id={formIds.cardType}
                name="cardType"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="viumi">Banco Macro (viüMi)</option>
                <option value="naranja">Tarjeta Naranja</option>
                <option value="payway">Banco de Corrientes (Payway)</option>
                <option value="otro">Otro banco (elige la mejor opción)</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor={formIds.installments} className="text-sm font-medium">Número de cuotas</label>
              <select
                id={formIds.installments}
                name="installments"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value))}
                className="border rounded-md p-2"
              >
                {availableInstallments.map((n) => {
                  const rate = getRateFor(cardType, n, settlement);
                  const label = n === 1 ? '1 (contado) – 0 %' : `${n} cuotas – ${rate.toFixed(2)} %`;
                  return (
                    <option key={n} value={n}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor={formIds.settlement} className="text-sm font-medium">Plazo de acreditación</label>
              <select
                id={formIds.settlement}
                name="settlement"
                value={settlement}
                onChange={(e) => setSettlement(parseInt(e.target.value))}
                className="border rounded-md p-2"
              >
                <option value={2}>2 días hábiles</option>
                <option value={5}>5 días hábiles</option>
                <option value={10}>10 días hábiles</option>
                <option value={20}>20 días hábiles</option>
                <option value={40}>40 días hábiles</option>
              </select>
            </div>
            
            {/* Opciones extras */}
            <div className="flex items-center space-x-4 bg-gray-100 p-3 rounded-lg border">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={formIds.useMacro}
                  name="useMacro"
                  className="accent-blue-600"
                  checked={useMacro}
                  onChange={(e) => setUseMacro(e.target.checked)}
                  disabled={cardType !== 'viumi'}
                />
                <span>Promoción Macro</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={formIds.useMiPyMe}
                  name="useMiPyMe"
                  className="accent-blue-600"
                  checked={useMiPyMe}
                  onChange={(e) => setUseMiPyMe(e.target.checked)}
                />
                <span>Plan MiPyME</span>
              </label>
            </div>
            
            <button
              onClick={handleCalculate}
              disabled={!isAmountValid}
              className={`px-4 py-2 rounded-lg shadow transition-colors ${
                isAmountValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Calcular
            </button>
          </div>

          {/* Resultados */}
          {result && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow space-y-2">
              <p className="text-sm">
                <strong>Proveedor:</strong> {result.provider}
              </p>
              <p className="text-base">
                <strong>Monto a cobrar total:</strong>{' '}
                <span className="text-lg font-semibold text-blue-600">
                  {formatCurrency(result.gross)}
                </span>
              </p>
              <p className="text-base">
                <strong>Valor de cada cuota:</strong>{' '}
                <span className="text-lg font-semibold text-blue-700">
                  {formatCurrency(result.installmentValue)}
                </span>
              </p>
              <p className="text-sm">
                <strong>Tasa de comisión:</strong> {result.commissionRate.toFixed(2)} %
              </p>
              <p className="text-sm">
                <strong>Tasa de financiación:</strong> {result.financeRate.toFixed(2)} %
              </p>
              <p className="text-sm">
                <strong>Tasa total (con IVA):</strong> {((result.commissionRate + result.financeRate) * (1 + VAT / 100)).toFixed(2)} %
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCalculatorModal;