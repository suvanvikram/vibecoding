export type TransactionType = 'expense' | 'income' | 'transfer' | 'investment';

export interface Transaction {
  id: string;
  type: TransactionType;
  merchant: string;
  category: string;
  date: string; // ISO date
  paymentMethod: string;
  amount: number;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'Equity' | 'Mutual Funds' | 'Gold' | 'Fixed Deposits' | 'Bonds' | 'Crypto' | 'Other';
  invested: number;
  currentValue: number;
  date: string;
  notes?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'Cash' | 'Bank accounts' | 'Investments' | 'Property' | 'Other';
  value: number;
}

export interface Liability {
  id: string;
  name: string;
  type: 'Loans' | 'Credit cards' | 'Other';
  value: number;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
}

export interface User {
  username: string;
  pin: string;
  name: string;
}

export interface FinanceState {
  user: User;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  assets: Asset[];
  liabilities: Liability[];
  incomeSources: IncomeSource[];
}

export const CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10B981',
  Shopping: '#3B82F6',
  Transport: '#F59E0B',
  Entertainment: '#8B5CF6',
  Bills: '#F43F5E',
  Healthcare: '#06B6D4',
  Education: '#EC4899',
  Other: '#64748B',
};

export const INVESTMENT_COLORS: Record<string, string> = {
  Equity: '#10B981',
  'Mutual Funds': '#3B82F6',
  Gold: '#F59E0B',
  'Fixed Deposits': '#06B6D4',
  Bonds: '#8B5CF6',
  Crypto: '#F43F5E',
  Other: '#64748B',
};

export const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Wallet'];
