import { useState } from 'react';
import { Plus, PiggyBank, Target, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import { getMonthlySavings, getMonthlyIncome, getSavingsRate, formatINR, formatINRFull } from '@/utils/finance';

const goalColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4', '#F43F5E'];

export function SavingsPage() {
  const { state, savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useFinance();
  const { notify } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<{ id: string; name: string; target: number; current: number; deadline: string; color: string } | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');

  const totalSavings = state.savingsGoals.reduce((s, g) => s + g.current, 0);
  const monthlySavings = getMonthlySavings(state.transactions);
  const monthlyIncome = getMonthlyIncome(state.transactions);
  const savingsRate = getSavingsRate(monthlyIncome, getMonthlyIncome(state.transactions));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(target);
    const c = parseFloat(current) || 0;
    if (!name.trim() || !t || t <= 0) return;
    const color = goalColors[savingsGoals.length % goalColors.length];
    try {
      if (editGoal) {
        await updateSavingsGoal(editGoal.id, { name: name.trim(), target: t, current: c, deadline, color: editGoal.color });
        notify('Savings goal updated');
      } else {
        await addSavingsGoal({ name: name.trim(), target: t, current: c, deadline, color });
        notify('Savings goal created', 'goal');
      }
      setModalOpen(false);
      setEditGoal(null);
      setName(''); setTarget(''); setCurrent(''); setDeadline('');
    } catch {
      notify('Failed to save savings goal', 'warning');
    }
  };

  const handleEdit = (g: typeof state.savingsGoals[0]) => {
    setEditGoal(g);
    setName(g.name); setTarget(String(g.target)); setCurrent(String(g.current)); setDeadline(g.deadline);
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Savings"
        subtitle="Track your savings goals and progress"
        actions={<Button onClick={() => { setEditGoal(null); setName(''); setTarget(''); setCurrent(''); setDeadline(''); setModalOpen(true); }}><Plus className="w-4 h-4" /> Create Savings Goal</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5" delay={0.05}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><PiggyBank className="w-5 h-5 text-success" /></div>
            <span className="text-sm text-text-secondary">Total Savings</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(totalSavings)}</div>
        </Card>
        <Card className="p-5" delay={0.1}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><Target className="w-5 h-5 text-accent-blue" /></div>
            <span className="text-sm text-text-secondary">Monthly Savings</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(monthlySavings)}</div>
        </Card>
        <Card className="p-5" delay={0.15}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center"><Target className="w-5 h-5 text-accent-violet" /></div>
            <span className="text-sm text-text-secondary">Savings Rate</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{savingsRate.toFixed(1)}%</div>
        </Card>
      </div>

      {/* Goals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.savingsGoals.map((g, i) => {
          const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
          const remaining = g.target - g.current;
          const deadlineDate = new Date(g.deadline);
          const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000);

          return (
            <Card key={g.id} className="p-5" hover delay={0.2 + i * 0.05}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${g.color}15` }}>
                    <Target className="w-5 h-5" style={{ color: g.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{g.name}</div>
                    <div className="text-xs text-text-tertiary flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      · {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(g)} className="text-xs text-text-tertiary hover:text-text-primary transition-colors px-2 py-1 rounded">Edit</button>
                  <button onClick={async () => { await deleteSavingsGoal(g.id); notify('Savings goal deleted', 'warning'); }} className="text-xs text-text-tertiary hover:text-danger transition-colors px-2 py-1 rounded">Delete</button>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-primary font-medium">{formatINR(g.current, true)}</span>
                <span className="text-text-tertiary">of {formatINR(g.target, true)}</span>
              </div>
              <ProgressBar value={g.current} max={g.target} color={g.color} height="h-3" />
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-text-secondary">{remaining > 0 ? `${formatINR(remaining, true)} remaining` : 'Goal reached!'}</span>
                <span className="font-medium" style={{ color: g.color }}>{pct.toFixed(1)}%</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editGoal ? 'Edit Savings Goal' : 'Create Savings Goal'} subtitle="Set a target and track your progress">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Goal Name" placeholder="e.g. Emergency Fund" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Target Amount (₹)" type="number" placeholder="0" value={target} onChange={(e) => setTarget(e.target.value)} required />
            <Input label="Current Amount (₹)" type="number" placeholder="0" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <Input label="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editGoal ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
