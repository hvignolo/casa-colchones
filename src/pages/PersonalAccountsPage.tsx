import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Plus,
    Search,
    User,
    Calendar,
    CheckCircle,
    AlertCircle,
    Clock,
    DollarSign,
    X,
    CreditCard,
    Edit,
    Trash2
} from 'lucide-react';
import { usePersonalAccounts } from '../hooks/usePersonalAccounts';
import { PersonalAccount } from '../types';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<PersonalAccount, 'id'>) => Promise<void>;
    initialData?: PersonalAccount | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<PersonalAccount>>(
        initialData || {
            customerName: '',
            dni: '',
            phone: '',
            address: '',
            productDetails: '',
            totalInstallments: 1,
            paidInstallments: 0,
            amountPerInstallment: 0,
            isDelivered: false,
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
            notes: '',
            amount: 0
        }
    );

    // Update form data when initialData changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                customerName: '',
                dni: '',
                phone: '',
                address: '',
                productDetails: '',
                totalInstallments: 1,
                paidInstallments: 0,
                amountPerInstallment: 0,
                isDelivered: false,
                startDate: new Date().toISOString().split('T')[0],
                status: 'active',
                notes: '',
                amount: 0
            });
        }
    }, [isOpen, initialData]);

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Validate required fields
            if (!formData.customerName || !formData.productDetails || !formData.amountPerInstallment) {
                alert('Por favor complete los campos obligatorios');
                return;
            }

            // Validate total amount
            const calculatedTotal = (formData.initialPayment || 0) + (formData.totalInstallments || 0) * (formData.amountPerInstallment || 0);
            const inputTotal = formData.amount || 0;

            // Allow a small margin of error for floating point calculations, though with currency it should be exact usually
            if (Math.abs(calculatedTotal - inputTotal) > 0.1) {
                alert(`Error de validación:\n\nEl Total Venta ($${inputTotal})\nNO COINCIDE con la suma de:\nEntrega Inicial ($${formData.initialPayment || 0}) + Cuotas ($${calculatedTotal - (formData.initialPayment || 0)})\n\nSuma calculada: $${calculatedTotal}`);
                return;
            }

            await onSubmit(formData as Omit<PersonalAccount, 'id'>);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Editar Cuenta' : 'Nueva Cuenta Corriente'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" /> Datos del Cliente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customerName}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                                <input
                                    type="text"
                                    value={formData.dni || ''}
                                    onChange={e => setFormData({ ...formData, dni: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    value={formData.address || ''}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Product & Payment Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-green-600" /> Detalles de Venta
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Producto / Detalle *</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.productDetails}
                                onChange={e => setFormData({ ...formData, productDetails: e.target.value })}
                                placeholder="Ej: Sommier King Size + 2 Almohadas"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Venta ($) *</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                placeholder="Monto total de la operación"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 border-blue-200 bg-blue-50 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Entrega Inicial ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.initialPayment || ''}
                                    onChange={e => setFormData({ ...formData, initialPayment: parseFloat(e.target.value) })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medio de Pago</label>
                                <input
                                    type="text"
                                    value={formData.initialPaymentMethod || ''}
                                    onChange={e => setFormData({ ...formData, initialPaymentMethod: e.target.value })}
                                    placeholder="Efectivo, Transferencia, etc."
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Cuotas</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.totalInstallments}
                                    onChange={e => setFormData({ ...formData, totalInstallments: parseInt(e.target.value) })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Cuota ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={formData.amountPerInstallment}
                                    onChange={e => setFormData({ ...formData, amountPerInstallment: parseFloat(e.target.value) })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.startDate?.split('T')[0]} // Ensure format YYYY-MM-DD
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isDelivered}
                                    onChange={e => setFormData({ ...formData, isDelivered: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700 font-medium">Mercadería Entregada</span>
                            </label>

                            {/* Only show paid installments input if editing, to correct mistakes */}
                            {initialData && (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Cuotas Pagas:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={formData.totalInstallments}
                                        value={formData.paidInstallments}
                                        onChange={e => setFormData({ ...formData, paidInstallments: parseInt(e.target.value) })}
                                        className="w-20 border rounded-lg p-1 text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                        <textarea
                            rows={3}
                            value={formData.notes || ''}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const PersonalAccountsPage: React.FC = () => {
    const navigate = useNavigate();
    const { accounts, loading, addAccount, updateAccount, deleteAccount, registerPayment } = usePersonalAccounts() as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'late'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<PersonalAccount | null>(null);

    const filteredAccounts = useMemo(() => {
        return accounts.filter((account: PersonalAccount) => {
            const matchesSearch =
                account.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                account.productDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (account.dni && account.dni.includes(searchQuery));

            const matchesStatus = filterStatus === 'all' || account.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [accounts, searchQuery, filterStatus]);

    const handleSaveAccount = async (data: Omit<PersonalAccount, 'id'>) => {
        if (selectedAccount?.id) {
            await updateAccount(selectedAccount.id, data);
        } else {
            await addAccount(data);
        }
    };

    // Handling payment registration
    const handlePayment = async (account: PersonalAccount) => {
        if (window.confirm(`¿Registrar pago de una cuota para ${account.customerName}?`)) {
            try {
                await registerPayment(account);
            } catch (error) {
                alert('Error al registrar pago');
            }
        }
    };

    const handleDelete = async (account: PersonalAccount) => {
        if (window.confirm(`¿Estás seguro de ELIMINAR la cuenta de ${account.customerName}? Esta acción no se puede deshacer.`)) {
            try {
                await deleteAccount(account.id);
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };

    const handleEdit = (account: PersonalAccount) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    const statusColors = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        late: 'bg-red-100 text-red-800',
        canceled: 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
        active: 'Activa',
        completed: 'Completada',
        late: 'Atrasada',
        canceled: 'Cancelada'
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Volver"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Cuentas Corrientes</h1>
                        </div>
                        <button
                            onClick={() => { setSelectedAccount(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Nueva Cuenta</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mt-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente, DNI o producto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                            {(['all', 'active', 'completed', 'late'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === status
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {status === 'all' ? 'Todas' : statusLabels[status]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredAccounts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-1">No se encontraron cuentas</h3>
                        <p className="text-gray-500">Intenta cambiar los filtros o crea una nueva cuenta.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAccounts.map((account: PersonalAccount) => (
                            <div key={account.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative group">
                                <div className="absolute top-14 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={() => handleEdit(account)}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(account)}
                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{account.customerName}</h3>
                                        <p className="text-sm text-gray-500 whitespace-pre-wrap mt-1">{account.productDetails}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${statusColors[account.status]}`}>
                                        {statusLabels[account.status]}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {account.amount && (
                                        <div className="flex items-center gap-2 text-sm text-gray-900 bg-gray-50 p-2 rounded-lg mb-2 font-bold justify-between">
                                            <span>Total Venta:</span>
                                            <span className="text-blue-700">${account.amount.toLocaleString('es-AR')}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <span>
                                            Cuota: <span className="font-semibold text-gray-900">${account.amountPerInstallment.toLocaleString('es-AR')}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>
                                            Progreso: {account.paidInstallments} / {account.totalInstallments} cuotas
                                        </span>
                                    </div>
                                    {/* Progress Bar */}
                                    {/* Segmented Progress Bar */}
                                    <div className="flex gap-1 w-full">
                                        {Array.from({ length: account.totalInstallments }).map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${index < account.paidInstallments ? 'bg-blue-600' : 'bg-gray-200'
                                                    }`}
                                                title={`Cuota ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>
                                            Inicio: {new Date(account.startDate).toLocaleDateString('es-AR')}
                                        </span>
                                    </div>
                                    {account.isDelivered ? (
                                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                                            <CheckCircle className="w-4 h-4" /> Entregado
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                            <AlertCircle className="w-4 h-4" /> Pendiente de Entrega
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePayment(account)}
                                        disabled={account.status === 'completed'}
                                        className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Registrar Pago
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveAccount}
                initialData={selectedAccount}
            />
        </div>
    );
};

export default PersonalAccountsPage;
