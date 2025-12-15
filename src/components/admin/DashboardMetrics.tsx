import React, { useMemo } from 'react';
import { usePersonalAccounts } from '../../hooks/usePersonalAccounts';
import { useCashSales } from '../../hooks/useCashSales';
import { DollarSign, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import { PersonalAccount } from '../../types';

interface MetricCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'green' | 'red' | 'indigo';
    loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, color, loading }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-full transition-transform hover:scale-[1.02] duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                {loading ? (
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                )}
                {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
            </div>
        </div>
    );
};

export const DashboardMetrics: React.FC = () => {
    const { accounts, loading: accountsLoading } = usePersonalAccounts();
    const { sales: cashSales, loading: cashSalesLoading } = useCashSales();

    const loading = accountsLoading || cashSalesLoading;

    const metrics = useMemo(() => {
        if (!accounts.length && !cashSales.length) return {
            salesMonth: 0,
            pendingInstallments: 0,
            expiringSoon: 0,
            estimatedProfit: 0
        };

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Ventas del mes (Amount of accounts created in current month + Cash Sales this month)
        const accountSalesMonth = accounts
            .filter(acc => {
                const created = new Date(acc.startDate); // Using startDate as proxy for sale date
                return created >= startOfMonth && created <= endOfMonth;
            })
            .reduce((sum, acc) => sum + (Number(acc.amount) || 0), 0);

        const cashSalesMonth = cashSales
            .filter(sale => {
                const date = new Date(sale.date);
                date.setHours(date.getHours() + 3); // Adjust for timezone roughly if needed, purely date based comparison
                // Better approach: string compare YYYY-MM
                // But following existing logic:
                return date >= startOfMonth && date <= endOfMonth;
            })
            .reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0);

        const salesMonth = accountSalesMonth + cashSalesMonth;

        // Cuotas pendientes de cobro (Remaining balance for active/late)
        // Logic: (totalInstallments - paidInstallments) * amountPerInstallment 
        // Note: This is an approximation. Ideally we'd sum up actual remaining debt.
        const pendingInstallments = accounts
            .filter(acc => acc.status === 'active' || acc.status === 'late')
            .reduce((sum, acc) => {
                const remaining = (Number(acc.totalInstallments) || 0) - (Number(acc.paidInstallments) || 0);
                return sum + (remaining * (Number(acc.amountPerInstallment) || 0));
            }, 0);

        // Cuotas próximas a vencer (Due within next 7 days?)
        // Since we don't have exact due dates for each installment in the simple model, 
        // we can estimate based on startDate and installments paid.
        // Assuming monthly installments.
        // Next due date = startDate + (paidInstallments + 1) months
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const expiringSoon = accounts
            .filter(acc => acc.status === 'active' || acc.status === 'late')
            .reduce((sum, acc) => {
                const nextDueDate = new Date(acc.startDate);
                const paid = Number(acc.paidInstallments) || 0;
                nextDueDate.setMonth(nextDueDate.getMonth() + paid + 1);

                // If due date is passed or within next 7 days
                if (nextDueDate <= sevenDaysFromNow) {
                    return sum + (Number(acc.amountPerInstallment) || 0);
                }
                return sum;
            }, 0);

        // Ganancia estimada (50% of sales of the month)
        const estimatedProfit = salesMonth * 0.5;

        return {
            salesMonth,
            pendingInstallments,
            expiringSoon,
            estimatedProfit
        };
    }, [accounts, cashSales]);

    const formatCurrency = (val: number) => {
        if (isNaN(val)) return '$ 0';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4">
            <MetricCard
                title="Ventas del Mes"
                value={formatCurrency(metrics.salesMonth)}
                subtitle="Total vendido este mes"
                icon={DollarSign}
                color="blue"
                loading={loading}
            />
            <MetricCard
                title="Pendiente de Cobro"
                value={formatCurrency(metrics.pendingInstallments)}
                subtitle="Total acumulado en cuotas"
                icon={Calendar}
                color="indigo"
                loading={loading}
            />
            <MetricCard
                title="Próximos Vencimientos"
                value={formatCurrency(metrics.expiringSoon)}
                subtitle="A vencer en 7 días"
                icon={AlertCircle}
                color="red"
                loading={loading}
            />
            <MetricCard
                title="Ganancia Estimada"
                value={formatCurrency(metrics.estimatedProfit)}
                icon={TrendingUp}
                color="green"
                loading={loading}
            />
        </div>
    );
};
