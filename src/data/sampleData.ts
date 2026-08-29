import type { FinanceState } from '@/types';

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return iso(d);
};

export const SAMPLE_STATE: FinanceState = {
  user: {
    username: 'admin',
    pin: '1234',
    name: 'Arjun Mehta',
  },
  transactions: [
    { id: 't1', type: 'income', merchant: 'Salary', category: 'Income', date: daysAgo(1), paymentMethod: 'Bank Transfer', amount: 125000 },
    { id: 't2', type: 'expense', merchant: 'Swiggy', category: 'Food', date: daysAgo(0), paymentMethod: 'UPI', amount: 640 },
    { id: 't3', type: 'expense', merchant: 'Amazon', category: 'Shopping', date: daysAgo(1), paymentMethod: 'Credit Card', amount: 3499 },
    { id: 't4', type: 'expense', merchant: 'Uber', category: 'Transport', date: daysAgo(2), paymentMethod: 'UPI', amount: 320 },
    { id: 't5', type: 'expense', merchant: 'Netflix', category: 'Entertainment', date: daysAgo(3), paymentMethod: 'Credit Card', amount: 649 },
    { id: 't6', type: 'expense', merchant: 'Big Bazaar', category: 'Food', date: daysAgo(3), paymentMethod: 'Debit Card', amount: 2400 },
    { id: 't7', type: 'expense', merchant: 'Electricity Board', category: 'Bills', date: daysAgo(4), paymentMethod: 'Bank Transfer', amount: 3200 },
    { id: 't8', type: 'income', merchant: 'Freelance Project', category: 'Income', date: daysAgo(5), paymentMethod: 'Bank Transfer', amount: 18000 },
    { id: 't9', type: 'expense', merchant: 'Apollo Pharmacy', category: 'Healthcare', date: daysAgo(6), paymentMethod: 'UPI', amount: 850 },
    { id: 't10', type: 'expense', merchant: 'PVR Cinemas', category: 'Entertainment', date: daysAgo(7), paymentMethod: 'Credit Card', amount: 1200 },
    { id: 't11', type: 'expense', merchant: 'Zomato', category: 'Food', date: daysAgo(8), paymentMethod: 'UPI', amount: 540 },
    { id: 't12', type: 'expense', merchant: 'Reliance Digital', category: 'Shopping', date: daysAgo(10), paymentMethod: 'Credit Card', amount: 5100 },
    { id: 't13', type: 'expense', merchant: 'Internet Bill', category: 'Bills', date: daysAgo(12), paymentMethod: 'UPI', amount: 1199 },
    { id: 't14', type: 'expense', merchant: 'Fuel', category: 'Transport', date: daysAgo(14), paymentMethod: 'Credit Card', amount: 2800 },
    { id: 't15', type: 'expense', merchant: 'Udemy Course', category: 'Education', date: daysAgo(15), paymentMethod: 'Debit Card', amount: 8499 },
    { id: 't16', type: 'expense', merchant: 'Swiggy', category: 'Food', date: daysAgo(16), paymentMethod: 'UPI', amount: 420 },
    { id: 't17', type: 'expense', merchant: 'Phone Recharge', category: 'Bills', date: daysAgo(18), paymentMethod: 'UPI', amount: 799 },
    { id: 't18', type: 'expense', merchant: 'Flipkart', category: 'Shopping', date: daysAgo(20), paymentMethod: 'Credit Card', amount: 2499 },
    { id: 't19', type: 'income', merchant: 'Dividend', category: 'Income', date: daysAgo(22), paymentMethod: 'Bank Transfer', amount: 4200 },
    { id: 't20', type: 'expense', merchant: 'Gym Membership', category: 'Healthcare', date: daysAgo(25), paymentMethod: 'UPI', amount: 1500 },
    { id: 't21', type: 'expense', merchant: 'Myntra', category: 'Shopping', date: daysAgo(27), paymentMethod: 'Credit Card', amount: 3100 },
    { id: 't22', type: 'expense', merchant: 'Big Bazaar', category: 'Food', date: daysAgo(28), paymentMethod: 'Debit Card', amount: 3200 },
    { id: 't23', type: 'expense', merchant: 'Insurance Premium', category: 'Bills', date: daysAgo(30), paymentMethod: 'Bank Transfer', amount: 8500 },
    { id: 't24', type: 'expense', merchant: 'Ola', category: 'Transport', date: daysAgo(32), paymentMethod: 'UPI', amount: 480 },
  ],
  budgets: [
    { id: 'b1', category: 'Food', limit: 15000, period: 'monthly' },
    { id: 'b2', category: 'Shopping', limit: 10000, period: 'monthly' },
    { id: 'b3', category: 'Transport', limit: 8000, period: 'monthly' },
    { id: 'b4', category: 'Entertainment', limit: 6000, period: 'monthly' },
    { id: 'b5', category: 'Bills', limit: 20000, period: 'monthly' },
    { id: 'b6', category: 'Healthcare', limit: 5000, period: 'monthly' },
  ],
  savingsGoals: [
    { id: 'g1', name: 'Emergency Fund', target: 300000, current: 200000, deadline: '2026-12-31', color: '#10B981' },
    { id: 'g2', name: 'MacBook Pro', target: 150000, current: 85000, deadline: '2026-06-30', color: '#3B82F6' },
    { id: 'g3', name: 'Travel Fund', target: 100000, current: 45000, deadline: '2026-12-15', color: '#F59E0B' },
    { id: 'g4', name: 'Home Down Payment', target: 1000000, current: 155000, deadline: '2028-01-01', color: '#8B5CF6' },
  ],
  investments: [
    { id: 'i1', name: 'Bluechip Equity Fund', type: 'Equity', invested: 320000, currentValue: 380000, date: '2023-01-15' },
    { id: 'i2', name: 'HDFC Mid-Cap', type: 'Mutual Funds', invested: 250000, currentValue: 295000, date: '2023-03-20' },
    { id: 'i3', name: 'Sovereign Gold Bond', type: 'Gold', invested: 120000, currentValue: 145000, date: '2023-05-10' },
    { id: 'i4', name: 'FD - SBI', type: 'Fixed Deposits', invested: 200000, currentValue: 215000, date: '2023-02-01' },
    { id: 'i5', name: 'Govt Bond 7.5%', type: 'Bonds', invested: 100000, currentValue: 108000, date: '2023-06-12' },
    { id: 'i6', name: 'Bitcoin', type: 'Crypto', invested: 80000, currentValue: 96500, date: '2023-04-18' },
    { id: 'i7', name: 'Nifty 50 ETF', type: 'Equity', invested: 130000, currentValue: 145500, date: '2023-07-22' },
    { id: 'i8', name: 'PPF', type: 'Other', invested: 100000, currentValue: 100000, date: '2023-01-01' },
  ],
  assets: [
    { id: 'a1', name: 'Cash on Hand', type: 'Cash', value: 25000 },
    { id: 'a2', name: 'HDFC Savings', type: 'Bank accounts', value: 542650 },
    { id: 'a3', name: 'ICICI Current', type: 'Bank accounts', value: 300000 },
    { id: 'a4', name: 'Investment Portfolio', type: 'Investments', value: 1284500 },
    { id: 'a5', name: '2BHK Apartment', type: 'Property', value: 6500000 },
    { id: 'a6', name: 'Gold Ornaments', type: 'Other', value: 130000 },
  ],
  liabilities: [
    { id: 'l1', name: 'Home Loan', type: 'Loans', value: 4500000 },
    { id: 'l2', name: 'Credit Card Outstanding', type: 'Credit cards', value: 33700 },
    { id: 'l3', name: 'Car Loan', type: 'Loans', value: 1800000 },
  ],
  incomeSources: [
    { id: 'is1', name: 'Salary', amount: 125000, frequency: 'monthly' },
    { id: 'is2', name: 'Freelancing', amount: 18000, frequency: 'monthly' },
    { id: 'is3', name: 'Dividends', amount: 4200, frequency: 'monthly' },
    { id: 'is4', name: 'Interest', amount: 3200, frequency: 'monthly' },
  ],
};
