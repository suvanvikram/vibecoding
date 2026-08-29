import { useState } from 'react';
import { Plus, IndianRupee, TrendingUp, BarChart3, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card, ChartCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import { getMonthlyIncome, getMonthlyTrend, formatINR, formatINRFull } from '@/utils/finance';
import { TrendChart } from '@/components/charts/Charts';

export function IncomePage() {
  const { state, addIncomeSource, updateIncomeSource, deleteIncomeSource } = useFinance();
  const { notify } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSrc, setEditSrc] = useState<{ id: string; name: string; amount: number; frequency: 'monthly' | 'yearly' } | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');

  const monthlyIncome = getMonthlyIncome(state.transactions);
  const yearlyIncome = monthlyIncome * 12;
  const avgMonthly = state.incomeSources.reduce((s, src) => s + (src.frequency === 'monthly' ? src.amount : src.amount / 12), 0);
  const trend = getMonthlyTrend(state.transactions, 12);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!name.trim() || !amt || amt <= 0) return;
    try {
      if (editSrc) {
        await updateIncomeSource(editSrc.id, { name: name.trim(), amount: amt, frequency });
        notify('Income source updated');
      } else {
        await addIncomeSource({ name: name.trim(), amount: amt, frequency });
        notify('Income source added');
      }
      setModalOpen(false);
      setEditSrc(null);
      setName(''); setAmount(''); setFrequency('monthly');
    } catch {
      notify('Failed to save income source', 'warning');
    }
  };

  return (
    <div>
      <PageHeader
        title="Income"
        subtitle="Track and manage your income sources"
        actions={<Button onClick={() => { setEditSrc(null); setName(''); setAmount(''); setModalOpen(true); }}><Plus className="w-4 h-4" /> Add Income Source</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5" delay={0.05}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><IndianRupee className="w-5 h-5 text-success" /></div>
            <span className="text-sm text-text-secondary">Monthly Income</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(monthlyIncome)}</div>
        </Card>
        <Card className="p-5" delay={0.1}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><TrendingUp className="w-5 h-5 text-accent-blue" /></div>
            <span className="text-sm text-text-secondary">Yearly Income</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(yearlyIncome)}</div>
        </Card>
        <Card className="p-5" delay={0.15}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><BarChart3 className="w-5 h-5 text-accent-violet" /></div>
            <span className="text-sm text-text-secondary">Avg Monthly Income</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(Math.round(avgMonthly))}</div>
        </Card>
      </div>

      {/* Income trend */}
      <ChartCard title="Income Trend" subtitle="Monthly income over the past year" delay={0.2}>
        <TrendChart data={trend} mode="income" />
      </ChartCard>

      {/* Income sources */}
      <Card className="p-5 mt-4" delay={0.25}>
        <h3 className="text-base font-semibold text-text-primary mb-4">Income Sources</h3>
        <div className="space-y-2">
          {state.incomeSources.map((src) => (
            <div key={src.id} className="flex items-center gap-4 p-3 rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{src.name}</div>
                <div className="text-xs text-text-secondary">{src.frequency === 'monthly' ? 'Monthly' : 'Yearly'}</div>
              </div>
              <div className="text-sm font-semibold text-success">+{formatINRFull(src.amount)}</div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditSrc(src); setName(src.name); setAmount(String(src.amount)); setFrequency(src.frequency); setModalOpen(true); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={async () => { await deleteIncomeSource(src.id); notify('Income source deleted', 'warning'); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-bg-hover"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editSrc ? 'Edit Income Source' : 'Add Income Source'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Source Name" placeholder="e.g. Salary, Freelancing" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <Input label="Amount (₹)" type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Select label="Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as 'monthly' | 'yearly')}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editSrc ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
