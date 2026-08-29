import type { FinanceState, Transaction } from '@/types';

export function formatINR(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (compact && Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (compact && Math.abs(amount) >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatINRFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getMonthTransactions(transactions: Transaction[], monthsBack = 0): Transaction[] {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
  });
}

export function getMonthlyIncome(transactions: Transaction[], monthsBack = 0): number {
  return getMonthTransactions(transactions, monthsBack)
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlyExpenses(transactions: Transaction[], monthsBack = 0): number {
  return getMonthTransactions(transactions, monthsBack)
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlySavings(transactions: Transaction[], monthsBack = 0): number {
  return getMonthlyIncome(transactions, monthsBack) - getMonthlyExpenses(transactions, monthsBack);
}

export function getSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
}

export function getTotalBalance(state: FinanceState): number {
  const assets = state.assets.reduce((s, a) => s + a.value, 0);
  const liabilities = state.liabilities.reduce((s, l) => s + l.value, 0);
  return assets - liabilities;
}

export function getNetWorth(state: FinanceState): number {
  return getTotalBalance(state);
}

export function getTotalAssets(state: FinanceState): number {
  return state.assets.reduce((s, a) => s + a.value, 0);
}

export function getTotalLiabilities(state: FinanceState): number {
  return state.liabilities.reduce((s, l) => s + l.value, 0);
}

export function getInvestmentValue(state: FinanceState): number {
  return state.investments.reduce((s, i) => s + i.currentValue, 0);
}

export function getInvestedAmount(state: FinanceState): number {
  return state.investments.reduce((s, i) => s + i.invested, 0);
}

export function getInvestmentReturns(state: FinanceState): number {
  return getInvestmentValue(state) - getInvestedAmount(state);
}

export function getInvestmentROI(state: FinanceState): number {
  const invested = getInvestedAmount(state);
  if (invested === 0) return 0;
  return (getInvestmentReturns(state) / invested) * 100;
}

export function getCategoryBreakdown(transactions: Transaction[]): { category: string; amount: number; percentage: number }[] {
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  const byCategory = new Map<string, number>();
  expenses.forEach(t => {
    byCategory.set(t.category, (byCategory.get(t.category) || 0) + t.amount);
  });
  return Array.from(byCategory.entries())
    .map(([category, amount]) => ({ category, amount, percentage: total > 0 ? (amount / total) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

export function getInvestmentBreakdown(state: FinanceState): { type: string; value: number; percentage: number }[] {
  const total = getInvestmentValue(state);
  const byType = new Map<string, number>();
  state.investments.forEach(i => {
    byType.set(i.type, (byType.get(i.type) || 0) + i.currentValue);
  });
  return Array.from(byType.entries())
    .map(([type, value]) => ({ type, value, percentage: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

export function getMonthlyTrend(transactions: Transaction[], months = 12): { month: string; income: number; expenses: number; savings: number }[] {
  const now = new Date();
  const trend: { month: string; income: number; expenses: number; savings: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const income = getMonthlyIncome(transactions, i);
    const expenses = getMonthlyExpenses(transactions, i);
    trend.push({ month: monthName, income, expenses, savings: income - expenses });
  }
  return trend;
}

export function getNetWorthHistory(state: FinanceState, months = 12): { month: string; value: number }[] {
  const currentNetWorth = getNetWorth(state);
  const trend = getMonthlyTrend(state.transactions, months);
  let cumulative = currentNetWorth;
  const history: { month: string; value: number }[] = [];
  for (let i = trend.length - 1; i >= 0; i--) {
    history.unshift({ month: trend[i].month, value: cumulative });
    cumulative -= trend[i].savings > 0 ? trend[i].savings * 0.8 : 0;
  }
  return history;
}

export function getPortfolioHistory(state: FinanceState, points = 12): { month: string; value: number }[] {
  const currentValue = getInvestmentValue(state);
  const invested = getInvestedAmount(state);
  const growth = currentValue - invested;
  const history: { month: string; value: number }[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const progress = (points - i) / points;
    const value = invested + growth * progress * (0.85 + Math.random() * 0.15);
    history.push({ month: monthName, value: Math.round(value) });
  }
  history[history.length - 1].value = currentValue;
  return history;
}

export function getFinancialHealthScore(state: FinanceState): {
  score: number;
  rating: string;
  breakdown: { label: string; score: number; max: number }[];
} {
  const income = getMonthlyIncome(state.transactions);
  const expenses = getMonthlyExpenses(state.transactions);
  const savingsRate = getSavingsRate(income, expenses);
  const emergencyFund = state.savingsGoals.find(g => g.name.toLowerCase().includes('emergency'));
  const emergencyRatio = emergencyFund ? emergencyFund.current / emergencyFund.target : 0;
  const investmentRatio = getInvestmentValue(state) / Math.max(getTotalAssets(state), 1);
  const debtRatio = getTotalLiabilities(state) / Math.max(getTotalAssets(state), 1);
  const expenseControl = income > 0 ? Math.max(0, 1 - expenses / income) : 0;

  const breakdown = [
    { label: 'Savings Rate', score: Math.min(100, savingsRate * 2), max: 100 },
    { label: 'Expense Control', score: Math.min(100, expenseControl * 100), max: 100 },
    { label: 'Emergency Fund', score: Math.min(100, emergencyRatio * 100), max: 100 },
    { label: 'Investment Allocation', score: Math.min(100, investmentRatio * 100), max: 100 },
    { label: 'Debt Ratio', score: Math.max(0, (1 - debtRatio) * 100), max: 100 },
  ];

  const score = Math.round(breakdown.reduce((s, b) => s + b.score, 0) / breakdown.length);
  let rating = 'Needs Work';
  if (score >= 80) rating = 'Excellent';
  else if (score >= 65) rating = 'Good';
  else if (score >= 50) rating = 'Fair';

  return { score, rating, breakdown };
}

export function getAverageDailySpending(transactions: Transaction[]): number {
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return 0;
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  const dates = new Set(expenses.map(t => t.date));
  return dates.size > 0 ? total / dates.size : 0;
}

export function getLargestExpense(transactions: Transaction[]): Transaction | null {
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return null;
  return expenses.reduce((max, t) => t.amount > max.amount ? t : max);
}
