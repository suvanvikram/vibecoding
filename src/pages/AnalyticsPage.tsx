import { useState } from 'react';
import { PageHeader, DateRangeSelector } from '@/components/ui/DateRangeSelector';
import { Card, ChartCard } from '@/components/ui/Card';
import { TrendChart, IncomeExpenseBarChart, DonutChart, SavingsTrendChart, NetWorthChart, PortfolioChart } from '@/components/charts/Charts';
import { useFinance } from '@/store/FinanceContext';
import {
  getMonthlyTrend, getCategoryBreakdown, getInvestmentBreakdown,
  getNetWorthHistory, getPortfolioHistory, getMonthlyIncome, getMonthlyExpenses,
  getMonthlySavings, getSavingsRate, getInvestmentValue, getInvestmentReturns,
  getInvestmentROI, formatINR,
} from '@/utils/finance';
import { CATEGORY_COLORS, INVESTMENT_COLORS } from '@/types';
import { TrendingUp, TrendingDown, PiggyBank, BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
  const { state } = useFinance();
  const [dateRange, setDateRange] = useState('thisMonth');

  const trend = getMonthlyTrend(state.transactions, 12);
  const breakdown = getCategoryBreakdown(state.transactions);
  const donutData = breakdown.map(c => ({ name: c.category, value: c.amount, percentage: c.percentage }));
  const investmentBreakdown = getInvestmentBreakdown(state);
  const investmentDonut = investmentBreakdown.map(i => ({ name: i.type, value: i.value, percentage: i.percentage }));
  const netWorthHistory = getNetWorthHistory(state, 12);
  const portfolioHistory = getPortfolioHistory(state, 12);

  const income = getMonthlyIncome(state.transactions);
  const expenses = getMonthlyExpenses(state.transactions);
  const savings = getMonthlySavings(state.transactions);
  const savingsRate = getSavingsRate(income, expenses);
  const investmentValue = getInvestmentValue(state);
  const investmentReturns = getInvestmentReturns(state);
  const investmentROI = getInvestmentROI(state);

  const rangeOptions = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Advanced financial insights and trends"
        actions={<DateRangeSelector value={dateRange} onChange={setDateRange} options={rangeOptions} />}
      />

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4" delay={0.05}>
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-success" /><span className="text-xs text-text-secondary">Income</span></div>
          <div className="text-xl font-bold text-text-primary">{formatINR(income, true)}</div>
        </Card>
        <Card className="p-4" delay={0.1}>
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-danger" /><span className="text-xs text-text-secondary">Expenses</span></div>
          <div className="text-xl font-bold text-text-primary">{formatINR(expenses, true)}</div>
        </Card>
        <Card className="p-4" delay={0.15}>
          <div className="flex items-center gap-2 mb-2"><PiggyBank className="w-4 h-4 text-accent-blue" /><span className="text-xs text-text-secondary">Savings</span></div>
          <div className="text-xl font-bold text-text-primary">{formatINR(savings, true)}</div>
        </Card>
        <Card className="p-4" delay={0.2}>
          <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-accent-violet" /><span className="text-xs text-text-secondary">Savings Rate</span></div>
          <div className="text-xl font-bold text-text-primary">{savingsRate.toFixed(1)}%</div>
        </Card>
      </div>

      {/* Income & Expense trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Income Trend" subtitle="Monthly income over time" delay={0.25}>
          <TrendChart data={trend} mode="income" />
        </ChartCard>
        <ChartCard title="Expense Trend" subtitle="Monthly expenses over time" delay={0.3}>
          <TrendChart data={trend} mode="expenses" />
        </ChartCard>
      </div>

      {/* Savings & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Savings Trend" subtitle="Monthly savings" delay={0.35}>
          <SavingsTrendChart data={trend} />
        </ChartCard>
        <ChartCard title="Category Spending" subtitle="Expense breakdown by category" delay={0.4}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <DonutChart data={donutData} colors={CATEGORY_COLORS} centerLabel="Total" centerValue={formatINR(expenses, true)} />
            <div className="space-y-2">
              {breakdown.slice(0, 6).map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[c.category] || '#64748B' }} />
                  <span className="text-sm text-text-primary flex-1">{c.category}</span>
                  <span className="text-sm font-medium text-text-primary">{formatINR(c.amount, true)}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Income vs Expenses comparison */}
      <ChartCard title="Monthly Comparison" subtitle="Income vs expenses" delay={0.45} className="mt-4">
        <IncomeExpenseBarChart data={trend} />
      </ChartCard>

      {/* Investment & Net Worth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Investment Performance" subtitle={`+${formatINR(investmentReturns, true)} (${investmentROI.toFixed(2)}%)`} delay={0.5}>
          <PortfolioChart data={portfolioHistory} color="#3B82F6" />
        </ChartCard>
        <ChartCard title="Net Worth Growth" subtitle={`${formatINR(investmentValue, true)} portfolio value`} delay={0.55}>
          <NetWorthChart data={netWorthHistory} color="#8B5CF6" />
        </ChartCard>
      </div>

      {/* Investment allocation */}
      <ChartCard title="Investment Allocation" subtitle="Asset distribution" delay={0.6} className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <DonutChart data={investmentDonut} colors={INVESTMENT_COLORS} centerLabel="Portfolio" centerValue={formatINR(investmentValue, true)} />
          <div className="space-y-2">
            {investmentBreakdown.map((i) => (
              <div key={i.type} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: INVESTMENT_COLORS[i.type] || '#64748B' }} />
                <span className="text-sm text-text-primary flex-1">{i.type}</span>
                <span className="text-sm font-medium text-text-primary">{formatINR(i.value, true)}</span>
                <span className="text-xs text-text-tertiary w-12 text-right">{i.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
