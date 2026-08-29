import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight,
  IndianRupee, BarChart3, ShieldCheck, Activity,
} from 'lucide-react';
import { Card, ChartCard } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { DateRangeSelector } from '@/components/ui/DateRangeSelector';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import {
  Sparkline, TrendChart, IncomeExpenseBarChart, DonutChart, PortfolioChart,
} from '@/components/charts/Charts';
import { useFinance } from '@/store/FinanceContext';
import { useCountUp } from '@/hooks/useCountUp';
import {
  formatINR, formatINRFull, getMonthlyIncome, getMonthlyExpenses, getMonthlySavings,
  getSavingsRate, getTotalBalance, getInvestmentValue, getInvestmentReturns,
  getInvestmentROI, getCategoryBreakdown, getInvestmentBreakdown, getMonthlyTrend,
  getPortfolioHistory, getFinancialHealthScore, getNetWorth,
} from '@/utils/finance';
import { CATEGORY_COLORS, INVESTMENT_COLORS } from '@/types';

function SummaryCard({ icon: Icon, title, value, change, changeLabel, sparkData, sparkColor, progress, delay }: {
  icon: React.ElementType; title: string; value: number; change?: string; changeLabel?: string;
  sparkData: { value: number }[]; sparkColor: string; progress?: number; delay: number;
}) {
  const animatedValue = useCountUp(value, 1500);
  const isPositive = change?.startsWith('+');

  return (
    <Card hover delay={delay} className="p-5 relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color: sparkColor }} />
        </div>
        {progress !== undefined && (
          <CircularProgress value={progress} max={100} size={44} strokeWidth={4} color={sparkColor} label={`${progress.toFixed(0)}%`} />
        )}
      </div>
      <div className="text-xs text-text-secondary mb-1">{title}</div>
      <div className="text-2xl font-bold text-text-primary mb-2">{formatINRFull(Math.round(animatedValue))}</div>
      <div className="flex items-center justify-between">
        {change && (
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>{change}</span>
            {changeLabel && <span className="text-xs text-text-tertiary">{changeLabel}</span>}
          </div>
        )}
      </div>
      <div className="mt-3 -mx-1">
        <Sparkline data={sparkData} color={sparkColor} height={36} />
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { state } = useFinance();
  const [dateRange, setDateRange] = useState('thisMonth');
  const [trendMode, setTrendMode] = useState<'expenses' | 'income' | 'savings'>('expenses');
  const [modalOpen, setModalOpen] = useState(false);

  const income = getMonthlyIncome(state.transactions);
  const expenses = getMonthlyExpenses(state.transactions);
  const savings = getMonthlySavings(state.transactions);
  const savingsRate = getSavingsRate(income, expenses);
  const totalBalance = getTotalBalance(state);
  const investmentValue = getInvestmentValue(state);
  const investmentReturns = getInvestmentReturns(state);
  const investmentROI = getInvestmentROI(state);
  const netWorth = getNetWorth(state);
  const health = getFinancialHealthScore(state);

  const categoryBreakdown = getCategoryBreakdown(
    dateRange === 'lastMonth' ? state.transactions.filter(t => {
      const d = new Date(t.date); const now = new Date();
      return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear();
    }) : state.transactions
  );

  const donutData = categoryBreakdown.map(c => ({ name: c.category, value: c.amount, percentage: c.percentage }));
  const investmentBreakdown = getInvestmentBreakdown(state);
  const investmentDonut = investmentBreakdown.map(i => ({ name: i.type, value: i.value, percentage: i.percentage }));

  const trend = getMonthlyTrend(state.transactions, 12);
  const portfolioHistory = getPortfolioHistory(state, 12);

  const lastMonthIncome = getMonthlyIncome(state.transactions, 1);
  const lastMonthExpenses = getMonthlyExpenses(state.transactions, 1);
  const incomeChange = lastMonthIncome > 0 ? ((income - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  const expenseChange = lastMonthExpenses > 0 ? ((expenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  const sparkData = (vals: number[]) => vals.map((v, i) => ({ value: v * (1 + (Math.sin(i) * 0.1)) }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={Wallet} title="Total Balance" value={totalBalance}
          change={`+${formatINR(savings, true)}`} changeLabel="this month"
          sparkData={sparkData([7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.42])}
          sparkColor="#10B981" delay={0.05}
        />
        <SummaryCard
          icon={TrendingUp} title="Monthly Income" value={income}
          change={`${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}%`} changeLabel="vs last month"
          sparkData={sparkData([1.1, 1.15, 1.2, 1.18, 1.22, 1.24, 1.25])}
          sparkColor="#3B82F6" delay={0.1}
        />
        <SummaryCard
          icon={TrendingDown} title="Monthly Expenses" value={expenses}
          change={`${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}%`} changeLabel="vs last month"
          sparkData={sparkData([0.72, 0.71, 0.70, 0.69, 0.68, 0.674, 0.674])}
          sparkColor="#F43F5E" delay={0.15}
        />
        <SummaryCard
          icon={PiggyBank} title="Monthly Savings" value={savings}
          changeLabel="Savings rate" change={`${savingsRate.toFixed(1)}%`}
          sparkData={sparkData([0.38, 0.44, 0.5, 0.48, 0.52, 0.55, 0.576])}
          sparkColor="#8B5CF6" progress={savingsRate} delay={0.2}
        />
      </div>

      {/* Financial Health + Spending by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card delay={0.25} className="p-5 lg:col-span-1">
          <h3 className="text-base font-semibold text-text-primary mb-4">Financial Health</h3>
          <div className="flex flex-col items-center">
            <CircularProgress
              value={health.score}
              max={100}
              size={140}
              strokeWidth={10}
              color={health.score >= 80 ? '#10B981' : health.score >= 65 ? '#3B82F6' : '#F59E0B'}
              label={String(health.score)}
              sublabel="out of 100"
            />
            <div className="mt-3 text-sm font-medium text-success">{health.rating}</div>
          </div>
          <div className="mt-5 space-y-2.5">
            {health.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">{b.label}</span>
                  <span className="text-text-primary font-medium">{Math.round(b.score)}/{b.max}</span>
                </div>
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.score}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: b.score >= 70 ? '#10B981' : b.score >= 40 ? '#F59E0B' : '#F43F5E' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <ChartCard title="Spending by Category" subtitle="Current month breakdown" delay={0.3}
          action={<DateRangeSelector value={dateRange} onChange={setDateRange} options={[
            { value: 'thisMonth', label: 'This Month' },
            { value: 'lastMonth', label: 'Last Month' },
            { value: 'last3Months', label: '3 Months' },
            { value: 'thisYear', label: 'This Year' },
          ]} />}
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <DonutChart data={donutData} colors={CATEGORY_COLORS} centerLabel="Total" centerValue={formatINR(expenses, true)} />
            <div className="space-y-2">
              {categoryBreakdown.slice(0, 6).map((c) => (
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

      {/* Monthly Spending Trend */}
      <ChartCard title="Monthly Spending Trend" subtitle="Income, expenses and savings over time" delay={0.35}
        action={
          <DateRangeSelector value={trendMode} onChange={(v) => setTrendMode(v as 'expenses' | 'income' | 'savings')} options={[
            { value: 'expenses', label: 'Expenses' },
            { value: 'income', label: 'Income' },
            { value: 'savings', label: 'Savings' },
          ]} />
        }
      >
        <TrendChart data={trend} mode={trendMode} />
      </ChartCard>

      {/* Income vs Expenses + Investment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Income vs Expenses" subtitle="Monthly comparison" delay={0.4}>
          <IncomeExpenseBarChart data={trend} />
        </ChartCard>

        <Card delay={0.45} className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary">Investment Portfolio</h3>
              <p className="text-xs text-text-secondary mt-0.5">Asset allocation</p>
            </div>
            <Link to="/investments" className="text-xs text-success hover:text-success-soft transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold text-text-primary">{formatINR(investmentValue, true)}</div>
              <div className="text-xs text-text-secondary mt-0.5">Total Value</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-lg font-semibold text-success">+{formatINR(investmentReturns, true)}</div>
              <div className="text-xs text-success">+{investmentROI.toFixed(2)}% ROI</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <DonutChart data={investmentDonut} colors={INVESTMENT_COLORS} centerLabel="Portfolio" centerValue={formatINR(investmentValue, true)} />
            <div className="space-y-2">
              {investmentBreakdown.slice(0, 5).map((i) => (
                <div key={i.type} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: INVESTMENT_COLORS[i.type] || '#64748B' }} />
                  <span className="text-sm text-text-primary flex-1">{i.type}</span>
                  <span className="text-xs text-text-tertiary">{i.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Investment Performance + Net Worth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Investment Performance" subtitle="Portfolio growth over time" delay={0.5}>
          <PortfolioChart data={portfolioHistory} color="#3B82F6" />
        </ChartCard>
        <Card delay={0.55} className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary">Net Worth</h3>
              <p className="text-xs text-text-secondary mt-0.5">Assets minus liabilities</p>
            </div>
            <Link to="/net-worth" className="text-xs text-success hover:text-success-soft transition-colors flex items-center gap-1">
              View details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="text-3xl font-bold text-text-primary mb-4">{formatINRFull(netWorth)}</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-elevated rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-xs text-text-secondary">Assets</span>
              </div>
              <div className="text-lg font-semibold text-text-primary">{formatINRFull(state.assets.reduce((s, a) => s + a.value, 0))}</div>
            </div>
            <div className="bg-bg-elevated rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-danger" />
                <span className="text-xs text-text-secondary">Liabilities</span>
              </div>
              <div className="text-lg font-semibold text-text-primary">{formatINRFull(state.liabilities.reduce((s, l) => s + l.value, 0))}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card delay={0.6} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Recent Transactions</h3>
            <p className="text-xs text-text-secondary mt-0.5">Your latest financial activity</p>
          </div>
          <Link to="/transactions" className="text-xs text-success hover:text-success-soft transition-colors flex items-center gap-1">
            View all transactions <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <TransactionTable transactions={state.transactions} maxItems={6} />
      </Card>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
