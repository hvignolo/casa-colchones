import React, { useState } from 'react';
import { X, DollarSign, FileText, Calendar, User, CreditCard, Banknote } from 'lucide-react';
import { CashSale } from '../../types';

interface CashSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (sale: Omit<CashSale, 'id' | 'createdAt'>) => Promise<void>;
}

export const CashSaleModal: React.FC<CashSaleModalProps> = ({ isOpen, onClose, onSave }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [clientName, setClientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>('Efectivo');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;

        setLoading(true);
        try {
            await onSave({
                amount: Number(amount),
                description,
                clientName,
                paymentMethod,
                date: new Date(date).toISOString(),
            });
            // Reset and close
            setAmount('');
            setDescription('');
            setClientName('');
            setPaymentMethod('Efectivo');
            setDate(new Date().toISOString().split('T')[0]);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error al guardar la venta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl transform transition-all">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Registrar Venta Contado</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>



                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medio de Pago</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('Efectivo')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${paymentMethod === 'Efectivo'
                                    ? 'bg-green-50 border-green-200 text-green-700 ring-2 ring-green-500 ring-opacity-50'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Banknote className="w-5 h-5" />
                                <span className="font-medium">Efectivo</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('Transferencia')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${paymentMethod === 'Transferencia'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span className="font-medium">Transferencia</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente (Opcional)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nombre del cliente"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Concepto / Detalle</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea
                                required
                                rows={3}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Venta de Colchón 1 Plaza..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            {loading ? 'Guardando...' : 'Registrar Venta'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};
