import { useState, useMemo } from 'react';
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import { CATEGORIES, PAYMENT_METHODS, type Transaction } from '@/types';

const PAGE_SIZE = 10;

export function TransactionsPage() {
  const { state, deleteTransaction } = useFinance();
  const { notify } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = [...state.transactions];
    if (search) result = result.filter(t => t.merchant.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== 'all') result = result.filter(t => t.type === filterType);
    if (filterCategory !== 'all') result = result.filter(t => t.category === filterCategory);
    if (filterPayment !== 'all') result = result.filter(t => t.paymentMethod === filterPayment);
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
    return result;
  }, [state.transactions, search, filterType, filterCategory, filterPayment, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleEdit = (t: Transaction) => {
    setEditTx(t);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      notify('Transaction deleted', 'warning');
    } catch {
      notify('Failed to delete transaction', 'warning');
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTx(null);
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Manage and track all your financial transactions"
        actions={
          <Button onClick={() => { setEditTx(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Transaction
          </Button>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-4" delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
            <option value="investment">Investment</option>
          </Select>
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="Income">Income</option>
          </Select>
          <Select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
            <option value="all">All Methods</option>
            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </Select>
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs text-text-secondary">{filtered.length} transactions found</span>
      </div>

      {/* Table */}
      {pageItems.length === 0 ? (
        <Card className="p-0" delay={0.1}>
          <EmptyState
            icon={<Filter className="w-8 h-8" />}
            title="No transactions found"
            description="Start tracking your finances by adding your first transaction."
            action={<Button onClick={() => { setEditTx(null); setModalOpen(true); }}><Plus className="w-4 h-4" /> Add Transaction</Button>}
          />
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden" delay={0.1}>
          <TransactionTable transactions={pageItems} onEdit={handleEdit} onDelete={handleDelete} />
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-text-secondary px-2">
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <TransactionModal open={modalOpen} onClose={handleClose} editTransaction={editTx} />
    </div>
  );
}
