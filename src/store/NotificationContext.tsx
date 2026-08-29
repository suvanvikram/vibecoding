import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, TrendingUp, Target, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'info' | 'goal';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface NotificationContextValue {
  notify: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: TrendingUp,
  goal: Target,
};

const colors = {
  success: 'text-success border-success/30',
  warning: 'text-amber-400 border-amber-400/30',
  info: 'text-accent-blue border-accent-blue/30',
  goal: 'text-accent-violet border-accent-violet/30',
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => setToasts(t => t.filter(x => x.id !== id));

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`glass-strong rounded-xl px-4 py-3 flex items-center gap-3 shadow-elevated min-w-[280px] max-w-sm pointer-events-auto animate-slide-up ${colors[toast.type]}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm text-text-primary flex-1">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} className="text-text-tertiary hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
