import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider, useFinance } from '@/store/FinanceContext';
import { NotificationProvider } from '@/store/NotificationContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { BudgetPage } from '@/pages/BudgetPage';
import { SavingsPage } from '@/pages/SavingsPage';
import { InvestmentsPage } from '@/pages/InvestmentsPage';
import { IncomePage } from '@/pages/IncomePage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { NetWorthPage } from '@/pages/NetWorthPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SettingsPage } from '@/pages/SettingsPage';

function ProtectedRoutes() {
  const { isAuthed } = useFinance();

  if (!isAuthed) return <LoginPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/net-worth" element={<NetWorthPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <NotificationProvider>
        <BrowserRouter>
          <ProtectedRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </FinanceProvider>
  );
}
