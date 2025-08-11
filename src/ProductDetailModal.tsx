import React, { useState } from 'react';
import { X, Calculator, CreditCard } from 'lucide-react';
import { useFinancingCalculator } from './useFinancingCalculator';

// Tipos TypeScript
interface Product {
  id: number;
  codigo: string;
  nombre: string;
  medidas: string;
  tipo: string;
  subtipo: string;
  precioContado: number;
  precioTarjeta: number;
  detalles: string;
  image: string;
  marca: string;
}

interface StoreData {
  name: string;
  location: string;
  phone: string;
  email: string;
  hours: string;
}

interface CalculatorPreloadData {
  amount: number;
  cardType: string;
  installments: number;
  settlement: number;
  useMacro: boolean;
  useMiPyMe: boolean;
}

interface ProductDetailModalProps {
  product: Product | null;
  storeData: StoreData;
  onClose: () => void;
  onOpenCalculator?: (preloadData: CalculatorPreloadData) => void;
  onCreateCartola?: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  storeData, 
  onClose,
  onOpenCalculator,
  onCreateCartola
}) => {
  // Estado para el widget de financiación
  const [selectedCard, setSelectedCard] = useState<string>('viumi');
  const [selectedInstallments, setSelectedInstallments] = useState<number>(6);
  const [useMacroPromo, setUseMacroPromo] = useState<boolean>(true);

  if (!product) return null;

  // Función para formatear precios con punto como separador de miles y coma
  // como separador decimal, usando dos decimales.
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Cálculo de financiación usando el hook personalizado
  const financingCalculation = useFinancingCalculator({
    amount: product.precioContado,
    cardType: selectedCard,
    installments: selectedInstallments,
    settlement: 10, // Fijo en 10 días
    useMacroPromo,
    useMiPyMe: false
  });

  // Opciones de cuotas disponibles
  const availableInstallments = [1, 3, 6, 9, 12];

  // Función para compartir por WhatsApp
  const shareOnWhatsApp = () => {
    const imageUrl = product.image;

    const message = `*${storeData.name}*
      
*${product.nombre}*
• Código: ${product.codigo}
• Marca: ${product.marca}
• Medidas: ${product.medidas}
• Tipo: ${product.tipo} - ${product.subtipo}

*PRECIOS:*
• Contado: $${formatPrice(product.precioContado)}
• Tarjeta: $${formatPrice(product.precioTarjeta)}
• Ahorrás: $${formatPrice(product.precioTarjeta - product.precioContado)} pagando de contado

*Descripción:*
${product.detalles}

*Imagen del producto:*
${imageUrl}

*Contacto:*
• Ubicación: ${storeData.location}
• Teléfono: ${storeData.phone}
• Horarios: ${storeData.hours}

¡Consultá por este producto y más opciones!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Función para abrir el calculador con datos precargados
  const openCalculatorWithData = () => {
    if (onOpenCalculator) {
      onOpenCalculator({
        amount: product.precioContado,
        cardType: selectedCard,
        installments: selectedInstallments,
        settlement: 10,
        useMacro: useMacroPromo,
        useMiPyMe: false
      });
    }
  };

  // Función para crear cartola
  const handleCreateCartola = () => {
    if (onCreateCartola) {
      onCreateCartola(product);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {product.nombre}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Código: {product.codigo}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {product.tipo}
                </span>
              </div>

              {/* Widget de Financiación Embebido */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Opciones de Financiación
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Monto: <span className="font-semibold text-gray-900">${formatPrice(product.precioContado)}</span> (precio contado)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarjeta
                      </label>
                      <select
                        value={selectedCard}
                        onChange={(e) => setSelectedCard(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="viumi">Banco Macro (viüMi)</option>
                        <option value="naranja">Tarjeta Naranja</option>
                        <option value="payway">Banco de Corrientes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cuotas
                      </label>
                      <select
                        value={selectedInstallments}
                        onChange={(e) => setSelectedInstallments(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {availableInstallments.map((n) => (
                          <option key={n} value={n}>
                            {n === 1 ? '1 (contado)' : `${n} cuotas`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedCard === 'viumi' && selectedInstallments > 1 && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="macroPromo"
                        checked={useMacroPromo}
                        onChange={(e) => setUseMacroPromo(e.target.checked)}
                        className="mr-2 accent-blue-600"
                      />
                      <label htmlFor="macroPromo" className="text-sm text-gray-700">
                        Promoción Macro
                      </label>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valor por cuota:</span>
                        <span className="text-lg font-bold text-blue-600">
                          ${formatPrice(financingCalculation.installmentValue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total a pagar:</span>
                        <span className="text-base font-semibold text-gray-900">
                          ${formatPrice(financingCalculation.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={openCalculatorWithData}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Calculator className="w-4 h-4" />
                    Calcular otras opciones
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Precios
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Precio de Contado</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${formatPrice(product.precioContado)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Precio con Tarjeta</span>
                    <span className="text-xl font-semibold text-blue-600">
                      ${formatPrice(product.precioTarjeta)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Ahorro pagando de contado
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        $
                        {formatPrice(
                          product.precioTarjeta - product.precioContado
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Marca</h4>
                  <p className="text-gray-700">{product.marca}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Subtipo</h4>
                  <p className="text-gray-700">{product.subtipo}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-2">Medidas</h4>
                  <p className="text-gray-700">{product.medidas}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Descripción
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {product.detalles}
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={shareOnWhatsApp}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  Compartir por WhatsApp
                </button>
                <button 
                  onClick={handleCreateCartola}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Cartola
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;