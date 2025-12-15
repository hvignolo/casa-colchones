import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashSales } from '../hooks/useCashSales';
import { usePersonalAccounts } from '../hooks/usePersonalAccounts';
import { parseCurrencyString } from '../utils';
import {
    Search,
    ArrowLeft,
    Download,
    Filter,
    CreditCard,
    Banknote,
    Calendar,
    DollarSign,
    Info,
    X
} from 'lucide-react';

interface SalesHistoryItem {
    id: string;
    date: Date;
    clientName: string;
    type: 'CONTADO' | 'FINANCIADO';
    amount: number;
    collectedAmount: number; // Actual money received (Cash or Initial + Installments)
    details: string;
    status?: string;
    // Breakdown fields for analytics
    initialPayment?: number;
    installmentsCollected?: number;
}

const SalesHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { sales: cashSales, loading: cashLoading } = useCashSales();
    const { accounts, loading: accountsLoading } = usePersonalAccounts();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'TODOS' | 'CONTADO' | 'FINANCIADO'>('TODOS');
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Combine and normalize data
    const allSales = useMemo<SalesHistoryItem[]>(() => {
        const normalizedCashSales: SalesHistoryItem[] = cashSales.map(sale => {
            const amount = parseCurrencyString(sale.amount);
            return {
                id: sale.id || Math.random().toString(),
                date: new Date(sale.date),
                clientName: sale.clientName || 'Cliente Final',
                type: 'CONTADO',
                amount: amount,
                collectedAmount: amount, // Cash sales are fully collected
                details: sale.description || 'Venta contado',
                initialPayment: 0,
                installmentsCollected: 0
            };
        });

        const normalizedAccounts: SalesHistoryItem[] = accounts.map(acc => {
            let finalAmount = parseCurrencyString(acc.amount);
            const initialPayment = acc.initialPayment ? parseCurrencyString(acc.initialPayment) : 0;
            const installmentVal = parseCurrencyString(acc.amountPerInstallment);
            const paidCount = Number(acc.paidInstallments) || 0;

            if (finalAmount === 0 && acc.amountPerInstallment && acc.totalInstallments) {
                const installmentsTotal = Number(acc.amountPerInstallment) * Number(acc.totalInstallments);
                finalAmount = installmentsTotal + initialPayment;
            }

            const installmentsCollectedAmount = installmentVal * paidCount;

            // Calculate total collected for this account so far:
            // Initial Payment + (Value of Paid Installments)
            const collectedSoFar = initialPayment + installmentsCollectedAmount;

            return {
                id: acc.id || Math.random().toString(),
                date: new Date(acc.startDate),
                clientName: acc.customerName,
                type: 'FINANCIADO',
                amount: finalAmount,
                collectedAmount: collectedSoFar,
                details: acc.productDetails || 'Financiación',
                status: acc.status,
                initialPayment: initialPayment,
                installmentsCollected: installmentsCollectedAmount
            };
        });

        return [...normalizedCashSales, ...normalizedAccounts].sort((a, b) =>
            b.date.getTime() - a.date.getTime()
        );
    }, [cashSales, accounts]);

    // Filter logic
    const filteredSales = useMemo(() => {
        return allSales.filter(item => {
            // Type filter
            if (filterType !== 'TODOS' && item.type !== filterType) return false;

            // Search filter
            const searchLower = searchQuery.toLowerCase();
            return (
                item.clientName.toLowerCase().includes(searchLower) ||
                item.details.toLowerCase().includes(searchLower) ||
                item.amount.toString().includes(searchLower)
            );
        });
    }, [allSales, filterType, searchQuery]);

    // Monthly Metrics (Static KPI for current month)
    const currentMonthMetrics = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthSales = allSales.filter(sale => {
            return sale.date.getMonth() === currentMonth && sale.date.getFullYear() === currentYear;
        });

        return monthSales.reduce((acc, curr) => ({
            total: acc.total + curr.amount,
            realIncome: acc.realIncome + curr.collectedAmount,
            count: acc.count + 1,
            cashTotal: curr.type === 'CONTADO' ? acc.cashTotal + curr.amount : acc.cashTotal,
            financedTotal: curr.type === 'FINANCIADO' ? acc.financedTotal + curr.amount : acc.financedTotal,
            // Breakdown sums
            breakdownCashSales: acc.breakdownCashSales + (curr.type === 'CONTADO' ? curr.collectedAmount : 0),
            breakdownDownPayments: acc.breakdownDownPayments + (curr.initialPayment || 0),
            breakdownInstallments: acc.breakdownInstallments + (curr.installmentsCollected || 0)
        }), {
            total: 0,
            realIncome: 0,
            count: 0,
            cashTotal: 0,
            financedTotal: 0,
            breakdownCashSales: 0,
            breakdownDownPayments: 0,
            breakdownInstallments: 0
        });
    }, [allSales]);

    // View Metrics (Dynamic based on filters)
    const viewSummary = useMemo(() => {
        return filteredSales.reduce((acc, curr) => ({
            total: acc.total + curr.amount,
            count: acc.count + 1,
            cashTotal: curr.type === 'CONTADO' ? acc.cashTotal + curr.amount : acc.cashTotal,
            financedTotal: curr.type === 'FINANCIADO' ? acc.financedTotal + curr.amount : acc.financedTotal
        }), { total: 0, count: 0, cashTotal: 0, financedTotal: 0 });
    }, [filteredSales]);

    const loading = cashLoading || accountsLoading;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-30">
                <div className="px-4 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Historial de Ventas</h1>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente, producto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                            <button
                                onClick={() => setFilterType('TODOS')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${filterType === 'TODOS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilterType('CONTADO')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${filterType === 'CONTADO' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Contado
                            </button>
                            <button
                                onClick={() => setFilterType('FINANCIADO')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${filterType === 'FINANCIADO' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Financiado
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Summary Metrics */}
                {/* KPI Section: Este Mes */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Resumen del Mes
                    </h2>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-white opacity-5"></div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Real Income (Cash Flow) */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-green-400/20 text-green-200 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-green-400/30">
                                        En Caja
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-blue-100 text-sm font-medium">Flujo Real Disponible</p>
                                    <button
                                        onClick={() => setShowDetailModal(true)}
                                        className="text-blue-200 hover:text-white transition-colors"
                                        title="Ver detalles"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    {formatCurrency(currentMonthMetrics.realIncome)}
                                </h3>
                                <p className="text-blue-200 text-sm">
                                    Ventas contado + Entregas + Cuotas cobradas
                                </p>
                            </div>

                            {/* Right Side: Total Sales Volume */}
                            <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                                <p className="text-blue-100 text-xs uppercase tracking-wider mb-2 font-medium">
                                    Volumen Total de Ventas
                                </p>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-2xl font-bold text-white">
                                        {formatCurrency(currentMonthMetrics.total)}
                                    </span>
                                </div>

                                {/* Breakdown Mini-stats */}
                                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
                                    <div>
                                        <p className="text-blue-200 text-xs mb-1">Contado</p>
                                        <p className="text-sm font-semibold">{formatCurrency(currentMonthMetrics.cashTotal)}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-200 text-xs mb-1">Financiado (Total)</p>
                                        <p className="text-sm font-semibold">{formatCurrency(currentMonthMetrics.financedTotal)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NOTE: Modal for Details */}
                {showDetailModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Detalle de Flujo</h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Ventas Contado</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(currentMonthMetrics.breakdownCashSales)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Entregas (Iniciales)</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(currentMonthMetrics.breakdownDownPayments)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Cuotas Cobradas</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(currentMonthMetrics.breakdownInstallments)}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total "En Caja"</span>
                                    <span className="font-bold text-blue-600 text-lg">{formatCurrency(currentMonthMetrics.realIncome)}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 text-center">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-blue-600 font-medium text-sm hover:underline"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtered View Summary */}
                <div className="mb-6">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                        Resultados de la Vista ({filterType.toLowerCase()})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <span className="text-gray-400 text-xs font-medium uppercase mb-1">Total en Lista</span>
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(viewSummary.total)}</span>
                            <span className="text-xs text-gray-400 mt-1">{viewSummary.count} registros</span>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <span className="text-gray-400 text-xs font-medium uppercase mb-1">Contado en Lista</span>
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(viewSummary.cashTotal)}</span>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <span className="text-gray-400 text-xs font-medium uppercase mb-1">Financiado en Lista</span>
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(viewSummary.financedTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(sale.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{sale.clientName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sale.type === 'CONTADO'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-indigo-100 text-indigo-800'
                                                }`}>
                                                {sale.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={sale.details}>
                                            {sale.details}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                            {formatCurrency(sale.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredSales.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No se encontraron ventas que coincidan con los filtros.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesHistoryPage;
