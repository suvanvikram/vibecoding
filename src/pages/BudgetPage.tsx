import { useState } from 'react';
import { Plus, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import { getMonthlyExpenses, formatINR, formatINRFull, getCategoryBreakdown } from '@/utils/finance';
import { CATEGORY_COLORS, CATEGORIES } from '@/types';

export function BudgetPage() {
  const { state, addBudget, updateBudget, deleteBudget } = useFinance();
  const { notify } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<{ id: string; category: string; limit: number } | null>(null);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');

  const expenses = getMonthlyExpenses(state.transactions);
  const monthTransactions = state.transactions.filter(t => {
    const d = new Date(t.date); const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense';
  });
  const breakdown = getCategoryBreakdown(monthTransactions);
  const spentByCategory = new Map(breakdown.map(b => [b.category, b.amount]));

  const totalBudget = state.budgets.reduce((s, b) => s + b.limit, 0);
  const remaining = totalBudget - expenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(limit);
    if (!amt || amt <= 0) return;
    try {
      if (editBudget) {
        await updateBudget(editBudget.id, { category, limit: amt });
        notify('Budget updated successfully');
      } else {
        await addBudget({ category, limit: amt, period: 'monthly' });
        notify('Budget created successfully');
      }
      setModalOpen(false);
      setEditBudget(null);
      setLimit('');
    } catch {
      notify('Failed to save budget', 'warning');
    }
  };

  const handleEdit = (b: { id: string; category: string; limit: number }) => {
    setEditBudget(b);
    setCategory(b.category);
    setLimit(String(b.limit));
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Budget"
        subtitle="Plan and track your monthly spending limits"
        actions={<Button onClick={() => { setEditBudget(null); setCategory('Food'); setLimit(''); setModalOpen(true); }}><Plus className="w-4 h-4" /> Create Budget</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5" delay={0.05}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><Wallet className="w-5 h-5 text-accent-blue" /></div>
            <span className="text-sm text-text-secondary">Monthly Budget</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(totalBudget)}</div>
        </Card>
        <Card className="p-5" delay={0.1}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-danger" /></div>
            <span className="text-sm text-text-secondary">Spent</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(expenses)}</div>
        </Card>
        <Card className="p-5" delay={0.15}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success" /></div>
            <span className="text-sm text-text-secondary">Remaining</span>
          </div>
          <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>{formatINRFull(remaining)}</div>
        </Card>
      </div>

      {/* Budget categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.budgets.map((b, i) => {
          const spent = spentByCategory.get(b.category) || 0;
          const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
          const isOver = spent > b.limit;
          const isWarning = pct >= 85 && !isOver;
          const color = CATEGORY_COLORS[b.category] || '#64748B';

          return (
            <Card key={b.id} className="p-5" hover delay={0.2 + i * 0.05}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                  <span className="text-sm font-medium text-text-primary">{b.category}</span>
                  {isOver && <span className="text-xs px-2 py-0.5 rounded-full bg-danger/10 text-danger">Over budget</span>}
                  {isWarning && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400">Warning</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { handleEdit(b); }} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Edit</button>
                  <button onClick={async () => { await deleteBudget(b.id); notify('Budget deleted', 'warning'); }} className="text-xs text-text-tertiary hover:text-danger transition-colors">Delete</button>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">{formatINR(spent, true)} spent</span>
                <span className="text-text-tertiary">of {formatINR(b.limit, true)}</span>
              </div>
              <ProgressBar value={spent} max={b.limit} color={color} height="h-2.5" />
              <div className="flex justify-between mt-2 text-xs">
                <span className={isOver ? 'text-danger' : 'text-text-secondary'}>
                  {isOver ? `${formatINR(spent - b.limit, true)} over` : `${formatINR(b.limit - spent, true)} left`}
                </span>
                <span className="text-text-tertiary">{pct.toFixed(0)}%</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editBudget ? 'Edit Budget' : 'Create Budget'} subtitle="Set a monthly spending limit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Monthly Limit (₹)" type="number" placeholder="0" value={limit} onChange={(e) => setLimit(e.target.value)} required autoFocus />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editBudget ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
