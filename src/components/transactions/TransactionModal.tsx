import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import { CATEGORIES, PAYMENT_METHODS, type TransactionType } from '@/types';
import { IndianRupee } from 'lucide-react';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editTransaction?: { id: string; type: TransactionType; merchant: string; category: string; date: string; paymentMethod: string; amount: number; notes?: string } | null;
}

const typeOptions: { value: TransactionType; label: string; color: string }[] = [
  { value: 'expense', label: 'Expense', color: '#F43F5E' },
  { value: 'income', label: 'Income', color: '#10B981' },
  { value: 'transfer', label: 'Transfer', color: '#3B82F6' },
  { value: 'investment', label: 'Investment', color: '#8B5CF6' },
];

export function TransactionModal({ open, onClose, editTransaction }: TransactionModalProps) {
  const { addTransaction, updateTransaction } = useFinance();
  const { notify } = useNotification();
  const [type, setType] = useState<TransactionType>('expense');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setMerchant(editTransaction.merchant);
      setCategory(editTransaction.category);
      setPaymentMethod(editTransaction.paymentMethod);
      setAmount(String(editTransaction.amount));
      setDate(editTransaction.date);
      setNotes(editTransaction.notes || '');
    } else if (open) {
      setType('expense');
      setMerchant('');
      setCategory('Food');
      setPaymentMethod('UPI');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [editTransaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!merchant.trim() || !amt || amt <= 0) return;

    setLoading(true);
    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, { type, merchant: merchant.trim(), category, paymentMethod, amount: amt, date, notes: notes.trim() || undefined });
        notify('Transaction updated successfully');
      } else {
        await addTransaction({ type, merchant: merchant.trim(), category, paymentMethod, amount: amt, date, notes: notes.trim() || undefined });
        notify('Transaction added successfully');
      }
      onClose();
    } catch {
      notify('Failed to save transaction', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaction' : 'Add Transaction'}
      subtitle="Track your financial activity"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">Transaction Type</label>
          <div className="grid grid-cols-4 gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  type === opt.value
                    ? 'bg-bg-hover border-border-strong text-text-primary'
                    : 'bg-bg-elevated border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
                style={type === opt.value ? { boxShadow: `0 0 0 1px ${opt.color}40` } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Amount"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          icon={<IndianRupee className="w-4 h-4" />}
          required
          autoFocus
        />

        <Input
          label="Merchant / Description"
          placeholder="e.g. Swiggy, Salary"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="Income">Income</option>
          </Select>
          <Select label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </div>

        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <Textarea label="Notes (Optional)" placeholder="Add a note..." rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1" loading={loading}>
            {editTransaction ? 'Update' : 'Save Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
