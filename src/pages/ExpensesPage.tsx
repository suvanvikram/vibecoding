import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card, ChartCard } from '@/components/ui/Card';
import { TrendChart, IncomeExpenseBarChart, DonutChart } from '@/components/charts/Charts';
import { useFinance } from '@/store/FinanceContext';
import {
  getMonthlyExpenses, getMonthlyTrend, getCategoryBreakdown,
  getAverageDailySpending, getLargestExpense, formatINR, formatINRFull, formatDate,
} from '@/utils/finance';
import { CATEGORY_COLORS } from '@/types';
import { TrendingDown, Calendar, ShoppingBag, IndianRupee } from 'lucide-react';

export function ExpensesPage() {
  const { state } = useFinance();
  const expenses = getMonthlyExpenses(state.transactions);
  const avgDaily = getAverageDailySpending(state.transactions);
  const largest = getLargestExpense(state.transactions);
  const trend = getMonthlyTrend(state.transactions, 12);
  const breakdown = getCategoryBreakdown(state.transactions);
  const donutData = breakdown.map(c => ({ name: c.category, value: c.amount, percentage: c.percentage }));

  return (
    <div>
      <PageHeader title="Expenses" subtitle="Analyze your spending patterns and habits" />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5" delay={0.05}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><IndianRupee className="w-5 h-5 text-danger" /></div>
            <span className="text-sm text-text-secondary">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(expenses)}</div>
        </Card>
        <Card className="p-5" delay={0.1}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><Calendar className="w-5 h-5 text-accent-blue" /></div>
            <span className="text-sm text-text-secondary">Avg Daily Spending</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(Math.round(avgDaily))}</div>
        </Card>
        <Card className="p-5" delay={0.15}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-accent-amber" /></div>
            <span className="text-sm text-text-secondary">Largest Category</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{breakdown[0]?.category || '—'}</div>
        </Card>
        <Card className="p-5" delay={0.2}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><TrendingDown className="w-5 h-5 text-danger" /></div>
            <span className="text-sm text-text-secondary">Largest Expense</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{largest ? formatINR(largest.amount, true) : '—'}</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Expense Trend" subtitle="Monthly expenses over time" delay={0.25}>
          <TrendChart data={trend} mode="expenses" />
        </ChartCard>
        <ChartCard title="Category Breakdown" subtitle="Where your money goes" delay={0.3}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <DonutChart data={donutData} colors={CATEGORY_COLORS} centerLabel="Total" centerValue={formatINR(expenses, true)} />
            <div className="space-y-2">
              {breakdown.map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[c.category] || '#64748B' }} />
                  <span className="text-sm text-text-primary flex-1">{c.category}</span>
                  <span className="text-sm font-medium text-text-primary">{formatINR(c.amount, true)}</span>
                  <span className="text-xs text-text-tertiary w-12 text-right">{c.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Income vs Expenses */}
      <ChartCard title="Income vs Expenses" subtitle="Monthly comparison" delay={0.35} className="mt-4">
        <IncomeExpenseBarChart data={trend} />
      </ChartCard>

      {/* Highest transactions */}
      <Card className="p-5 mt-4" delay={0.4}>
        <h3 className="text-base font-semibold text-text-primary mb-4">Highest Expense Transactions</h3>
        <div className="space-y-2">
          {[...state.transactions].filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-4 p-3 rounded-xl bg-bg-elevated/50">
              <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-danger" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{t.merchant}</div>
                <div className="text-xs text-text-secondary">{t.category} · {formatDate(t.date)} · {t.paymentMethod}</div>
              </div>
              <div className="text-sm font-semibold text-danger">-{formatINRFull(t.amount)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
