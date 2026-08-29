import type { Transaction } from '@/types';
import { CATEGORY_COLORS } from '@/types';
import { formatINR, formatDate } from '@/utils/finance';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
}

export function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  const color = CATEGORY_COLORS[transaction.category] || '#64748B';

  return (
    <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 hover:bg-bg-elevated/50 transition-colors group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
        {isIncome ? (
          <ArrowUpRight className="w-5 h-5" style={{ color }} />
        ) : (
          <ArrowDownRight className="w-5 h-5" style={{ color }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary truncate">{transaction.merchant}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-text-secondary">{transaction.category}</span>
          <span className="text-text-tertiary text-xs">·</span>
          <span className="text-xs text-text-secondary">{formatDate(transaction.date)}</span>
          <span className="text-text-tertiary text-xs hidden sm:inline">·</span>
          <span className="text-xs text-text-secondary hidden sm:inline">{transaction.paymentMethod}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span className={`text-sm font-semibold ${isIncome ? 'text-success' : 'text-danger'}`}>
          {isIncome ? '+' : '-'}{formatINR(transaction.amount)}
        </span>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={() => onEdit(transaction)} className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(transaction.id)} className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-bg-hover transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
  maxItems?: number;
}

export function TransactionTable({ transactions, onEdit, onDelete, maxItems }: TransactionTableProps) {
  const items = maxItems ? transactions.slice(0, maxItems) : transactions;
  return (
    <div className="divide-y divide-border-subtle">
      {items.map((t) => (
        <TransactionRow key={t.id} transaction={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
