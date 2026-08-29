import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card, ChartCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { NetWorthChart } from '@/components/charts/Charts';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import { getNetWorth, getTotalAssets, getTotalLiabilities, getNetWorthHistory, formatINR, formatINRFull } from '@/utils/finance';
import type { Asset, Liability } from '@/types';

const assetTypes = ['Cash', 'Bank accounts', 'Investments', 'Property', 'Other'] as const;
const liabilityTypes = ['Loans', 'Credit cards', 'Other'] as const;

export function NetWorthPage() {
  const { state, addAsset, updateAsset, deleteAsset, addLiability, updateLiability, deleteLiability } = useFinance();
  const { notify } = useNotification();
  const [assetModal, setAssetModal] = useState(false);
  const [liabilityModal, setLiabilityModal] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [editLiability, setEditLiability] = useState<Liability | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [timeRange, setTimeRange] = useState('1Y');

  const netWorth = getNetWorth(state);
  const totalAssets = getTotalAssets(state);
  const totalLiabilities = getTotalLiabilities(state);

  const rangeMap: Record<string, number> = { '1M': 1, '6M': 6, '1Y': 12, '3Y': 36, 'All': 60 };
  const netWorthHistory = getNetWorthHistory(state, rangeMap[timeRange] || 12);

  const handleAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(value);
    if (!name.trim() || !v || v <= 0) return;
    try {
      if (editAsset) {
        await updateAsset(editAsset.id, { name: name.trim(), type: type as Asset['type'], value: v });
        notify('Asset updated');
      } else {
        await addAsset({ name: name.trim(), type: (type || 'Cash') as Asset['type'], value: v });
        notify('Asset added');
      }
      setAssetModal(false);
      setEditAsset(null);
      setName(''); setType('Cash'); setValue('');
    } catch {
      notify('Failed to save asset', 'warning');
    }
  };

  const handleLiabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(value);
    if (!name.trim() || !v || v <= 0) return;
    try {
      if (editLiability) {
        await updateLiability(editLiability.id, { name: name.trim(), type: type as Liability['type'], value: v });
        notify('Liability updated');
      } else {
        await addLiability({ name: name.trim(), type: (type || 'Loans') as Liability['type'], value: v });
        notify('Liability added');
      }
      setLiabilityModal(false);
      setEditLiability(null);
      setName(''); setType('Loans'); setValue('');
    } catch {
      notify('Failed to save liability', 'warning');
    }
  };

  return (
    <div>
      <PageHeader title="Net Worth" subtitle="Track your assets and liabilities over time" />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5" delay={0.05}>
          <div className="text-xs text-text-secondary mb-1">Current Net Worth</div>
          <div className="text-3xl font-bold text-text-primary">{formatINRFull(netWorth)}</div>
        </Card>
        <Card className="p-5" delay={0.1}>
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-success" /><span className="text-xs text-text-secondary">Total Assets</span></div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(totalAssets)}</div>
        </Card>
        <Card className="p-5" delay={0.15}>
          <div className="flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-danger" /><span className="text-xs text-text-secondary">Total Liabilities</span></div>
          <div className="text-2xl font-bold text-text-primary">{formatINRFull(totalLiabilities)}</div>
        </Card>
      </div>

      {/* Net Worth Chart */}
      <ChartCard title="Net Worth History" subtitle="Growth over time" delay={0.2}
        action={
          <div className="inline-flex items-center gap-1 bg-bg-elevated rounded-xl p-1 border border-border-subtle">
            {['1M', '6M', '1Y', '3Y', 'All'].map(r => (
              <button key={r} onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${timeRange === r ? 'bg-bg-hover text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                {r}
              </button>
            ))}
          </div>
        }
      >
        <NetWorthChart data={netWorthHistory} color="#8B5CF6" />
      </ChartCard>

      {/* Assets vs Liabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Assets */}
        <Card className="p-5" delay={0.25}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-success" /></div>
              <div>
                <h3 className="text-base font-semibold text-text-primary">Assets</h3>
                <span className="text-xs text-text-secondary">{formatINR(totalAssets, true)}</span>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => { setEditAsset(null); setName(''); setType('Cash'); setValue(''); setAssetModal(true); }}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
          <div className="space-y-2">
            {state.assets.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated transition-colors group">
                <div className="w-2.5 h-2.5 rounded-full bg-success flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{a.name}</div>
                  <div className="text-xs text-text-tertiary">{a.type}</div>
                </div>
                <span className="text-sm font-medium text-text-primary">{formatINR(a.value, true)}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditAsset(a); setName(a.name); setType(a.type); setValue(String(a.value)); setAssetModal(true); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={async () => { await deleteAsset(a.id); notify('Asset deleted', 'warning'); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-bg-hover"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Liabilities */}
        <Card className="p-5" delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-danger" /></div>
              <div>
                <h3 className="text-base font-semibold text-text-primary">Liabilities</h3>
                <span className="text-xs text-text-secondary">{formatINR(totalLiabilities, true)}</span>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => { setEditLiability(null); setName(''); setType('Loans'); setValue(''); setLiabilityModal(true); }}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
          <div className="space-y-2">
            {state.liabilities.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated transition-colors group">
                <div className="w-2.5 h-2.5 rounded-full bg-danger flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{l.name}</div>
                  <div className="text-xs text-text-tertiary">{l.type}</div>
                </div>
                <span className="text-sm font-medium text-text-primary">{formatINR(l.value, true)}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditLiability(l); setName(l.name); setType(l.type); setValue(String(l.value)); setLiabilityModal(true); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={async () => { await deleteLiability(l.id); notify('Liability deleted', 'warning'); }} className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-bg-hover"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Asset Modal */}
      <Modal open={assetModal} onClose={() => setAssetModal(false)} title={editAsset ? 'Edit Asset' : 'Add Asset'}>
        <form onSubmit={handleAssetSubmit} className="space-y-4">
          <Input label="Name" placeholder="e.g. Savings Account" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <Select label="Type" value={type || 'Cash'} onChange={(e) => setType(e.target.value)}>
            {assetTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Input label="Value (₹)" type="number" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setAssetModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editAsset ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>

      {/* Liability Modal */}
      <Modal open={liabilityModal} onClose={() => setLiabilityModal(false)} title={editLiability ? 'Edit Liability' : 'Add Liability'}>
        <form onSubmit={handleLiabilitySubmit} className="space-y-4">
          <Input label="Name" placeholder="e.g. Home Loan" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <Select label="Type" value={type || 'Loans'} onChange={(e) => setType(e.target.value)}>
            {liabilityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Input label="Value (₹)" type="number" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setLiabilityModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editLiability ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
