import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Wallet, PiggyBank, TrendingUp,
  IndianRupee, TrendingDown, BarChart3, Settings, LogOut, ChevronLeft,
  User as UserIcon, X,
} from 'lucide-react';
import { useFinance } from '@/store/FinanceContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/savings', label: 'Savings', icon: PiggyBank },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  { to: '/income', label: 'Income', icon: IndianRupee },
  { to: '/expenses', label: 'Expenses', icon: TrendingDown },
  { to: '/net-worth', label: 'Net Worth', icon: BarChart3 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const { state, logout } = useFinance();
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 h-16 border-b border-border-subtle ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-success to-success-soft flex items-center justify-center flex-shrink-0 shadow-glow">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="text-xl font-bold tracking-tight">FINOVA</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-text-primary bg-bg-elevated'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-success"
                />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-border-subtle p-3">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {state.user.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">{state.user.name}</div>
              <div className="text-xs text-text-tertiary truncate">@{state.user.username}</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex items-center gap-1 mt-1">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors">
              <UserIcon className="w-3.5 h-3.5" /> Profile
            </button>
            <button onClick={logout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block fixed left-0 top-0 h-screen bg-bg-secondary border-r border-border-subtle z-40"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-bg-secondary border-r border-border-subtle z-50"
            >
              {sidebarContent}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
