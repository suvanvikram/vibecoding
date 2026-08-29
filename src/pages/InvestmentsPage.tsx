import { useState } from 'react';
import { Plus, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card, ChartCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DonutChart, PortfolioChart } from '@/components/charts/Charts';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import {
  getInvestmentValue, getInvestedAmount, getInvestmentReturns, getInvestmentROI,
  getInvestmentBreakdown, getPortfolioHistory, formatINR, formatINRFull,
} from '@/utils/finance';
import { INVESTMENT_COLORS, type Investment } from '@/types';

const investmentTypes = ['Equity', 'Mutual Funds', 'Gold', 'Fixed Deposits', 'Bonds', 'Crypto', 'Other'] as const;

export function InvestmentsPage() {
  const { state, addInvestment, updateInvestment, deleteInvestment } = useFinance();
  const { notify } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editInv, setEditInv] = useState<Investment | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<typeof investmentTypes[number]>('Equity');
  const [invested, setInvested] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [timeRange, setTimeRange] = useState('1Y');

  const portfolioValue = getInvestmentValue(state);
  const investedAmount = getInvestedAmount(state);
  const returns = getInvestmentReturns(state);
  const roi = getInvestmentROI(state);
  const breakdown = getInvestmentBreakdown(state);
  const donutData = breakdown.map(b => ({ name: b.type, value: b.value, percentage: b.percentage }));

  const rangeMap: Record<string, number> = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12, '3Y': 36, '5Y': 60 };
  const portfolioHistory = getPortfolioHistory(state, rangeMap[timeRange] || 12);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inv = parseFloat(invested);
    const cur = parseFloat(currentValue);
    if (!name.trim() || !inv || inv <= 0 || !cur || cur <= 0) return;
    try {
      if (editInv) {
        await updateInvestment(editInv.id, { name: name.trim(), type, invested: inv, currentValue: cur, date, notes: notes.trim() || undefined });
        notify('Investment updated');
      } else {
        await addInvestment({ name: name.trim(), type, invested: inv, currentValue: cur, date, notes: notes.trim() || undefined });
        notify('Investment added');
      }
      setModalOpen(false);
      setEditInv(null);
      resetForm();
    } catch {
      notify('Failed to save investment', 'warning');
    }
  };

  const resetForm = () => {
    setName(''); setType('Equity'); setInvested(''); setCurrentValue('');
    setDate(new Date().toISOString().slice(0, 10)); setNotes('');
  };

  const handleEdit = (inv: Investment) => {
    setEditInv(inv);
    setName(inv.name); setType(inv.type); setInvested(String(inv.invested));
    setCurrentValue(String(inv.currentValue)); setDate(inv.date); setNotes(inv.notes || '');
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Investments"
        subtitle="Track your portfolio performance and asset allocation"
        actions={<Button onClick={() => { setEditInv(null); resetForm(); setModalOpen(true); }}><Plus className="w-4 h-4" /> Add Investment</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5" delay={0.05}>
          <div className="text-xs text-text-secondary mb-1">Portfolio Value</div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(portfolioValue)}</div>
        </Card>
        <Card className="p-5" delay={0.1}>
          <div className="text-xs text-text-secondary mb-1">Invested Amount</div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(investedAmount)}</div>
        </Card>
        <Card className="p-5" delay={0.15}>
          <div className="text-xs text-text-secondary mb-1">Total Returns</div>
          <div className="text-2xl font-bold text-success">+{formatINRFull(returns)}</div>
        </Card>
        <Card className="p-5" delay={0.2}>
          <div className="text-xs text-text-secondary mb-1">ROI</div>
          <div className="text-2xl font-bold text-success">+{roi.toFixed(2)}%</div>
        </Card>
      </div>

      {/* Allocation + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Asset Allocation" subtitle="Portfolio distribution by type" delay={0.25}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <DonutChart data={donutData} colors={INVESTMENT_COLORS} centerLabel="Total" centerValue={formatINR(portfolioValue, true)} />
            <div className="space-y-2">
              {breakdown.map((b) => (
                <div key={b.type} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: INVESTMENT_COLORS[b.type] || '#64748B' }} />
                  <span className="text-sm text-text-primary flex-1">{b.type}</span>
                  <span className="text-sm font-medium text-text-primary">{formatINR(b.value, true)}</span>
                  <span className="text-xs text-text-tertiary w-12 text-right">{b.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Portfolio Performance" subtitle="Growth over time" delay={0.3}
          action={
            <div className="inline-flex items-center gap-1 bg-bg-elevated rounded-xl p-1 border border-border-subtle">
              {['1M', '3M', '6M', '1Y', '3Y', '5Y'].map(r => (
                <button key={r} onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${timeRange === r ? 'bg-bg-hover text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                  {r}
                </button>
              ))}
            </div>
          }
        >
          <PortfolioChart data={portfolioHistory} color="#3B82F6" />
        </ChartCard>
      </div>

      {/* Investment list */}
      <Card className="p-5" delay={0.35}>
        <h3 className="text-base font-semibold text-text-primary mb-4">Investment Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-text-tertiary border-b border-border-subtle">
                <th className="text-left font-medium pb-3 pr-4">Asset</th>
                <th className="text-left font-medium pb-3 pr-4">Type</th>
                <th className="text-right font-medium pb-3 pr-4">Invested</th>
                <th className="text-right font-medium pb-3 pr-4">Current</th>
                <th className="text-right font-medium pb-3 pr-4">Returns</th>
                <th className="text-right font-medium pb-3 pr-4">ROI</th>
                <th className="text-right font-medium pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {state.investments.map((inv) => {
                const ret = inv.currentValue - inv.invested;
                const invRoi = inv.invested > 0 ? (ret / inv.invested) * 100 : 0;
                return (
                  <tr key={inv.id} className="group">
                    <td className="py-3 pr-4">
                      <div className="text-sm font-medium text-text-primary">{inv.name}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${INVESTMENT_COLORS[inv.type]}15`, color: INVESTMENT_COLORS[inv.type] }}>
                        {inv.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-sm text-text-secondary">{formatINR(inv.invested, true)}</td>
                    <td className="py-3 pr-4 text-right text-sm font-medium text-text-primary">{formatINR(inv.currentValue, true)}</td>
                    <td className={`py-3 pr-4 text-right text-sm font-medium ${ret >= 0 ? 'text-success' : 'text-danger'}`}>
                      {ret >= 0 ? '+' : ''}{formatINR(ret, true)}
                    </td>
                    <td className={`py-3 pr-4 text-right text-sm font-medium ${ret >= 0 ? 'text-success' : 'text-danger'}`}>
                      {ret >= 0 ? '+' : ''}{invRoi.toFixed(2)}%
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(inv)} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={async () => { await deleteInvestment(inv.id); notify('Investment deleted', 'warning'); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-bg-hover"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editInv ? 'Edit Investment' : 'Add Investment'} subtitle="Track your investment holdings">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Asset Name" placeholder="e.g. Bluechip Equity Fund" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <Select label="Asset Type" value={type} onChange={(e) => setType(e.target.value as typeof investmentTypes[number])}>
            {investmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Invested Amount (₹)" type="number" placeholder="0" value={invested} onChange={(e) => setInvested(e.target.value)} required />
            <Input label="Current Value (₹)" type="number" placeholder="0" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} required />
          </div>
          <Input label="Purchase Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Textarea label="Notes (Optional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editInv ? 'Update' : 'Add Investment'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
