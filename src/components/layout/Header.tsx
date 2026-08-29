import { useState } from 'react';
import { Menu, Bell, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFinance } from '@/store/FinanceContext';

interface HeaderProps {
  onMenuClick: () => void;
  onQuickAdd: () => void;
}

export function Header({ onMenuClick, onQuickAdd }: HeaderProps) {
  const { state } = useFinance();
  const [showNotifs, setShowNotifs] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const notifications = [
    { icon: '✓', text: 'Transaction added successfully', time: '2m ago', color: 'text-success' },
    { icon: '⚠', text: 'Food budget is 85% used', time: '1h ago', color: 'text-amber-400' },
    { icon: '📈', text: 'Investment portfolio increased by 4.2%', time: '3h ago', color: 'text-accent-blue' },
    { icon: '🎯', text: 'Savings goal reached 75%', time: '5h ago', color: 'text-accent-violet' },
  ];

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border-subtle">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-text-primary">{greeting}, {state.user.name.split(' ')[0]}</h2>
            <p className="text-xs text-text-secondary">Here's your financial overview.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search - desktop */}
          <div className="hidden md:flex items-center gap-2 bg-bg-elevated border border-border-subtle rounded-xl px-3 py-2 w-48 lg:w-64">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input
              placeholder="Search..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none flex-1"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-success animate-pulse" />
            </button>
            {showNotifs && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl shadow-elevated p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 text-xs font-medium text-text-secondary">Notifications</div>
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-elevated transition-colors cursor-pointer">
                      <span className={`text-lg ${n.color}`}>{n.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{n.text}</p>
                        <p className="text-xs text-text-tertiary mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Add */}
          <Button onClick={onQuickAdd} size="md" className="shadow-glow">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
