import { type ReactNode } from 'react';

export type DateRange = 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear' | '6months' | '12months' | '1month' | '3months' | '6M' | '1Y' | '3Y' | '5Y' | 'all';

interface DateRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
}

const defaultOptions = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'thisYear', label: 'This Year' },
];

export function DateRangeSelector({ value, onChange, options = defaultOptions }: DateRangeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-bg-elevated rounded-xl p-1 border border-border-subtle">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
            value === opt.value
              ? 'bg-bg-hover text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function TimeRangeSelector({ value, onChange, options }: DateRangeSelectorProps) {
  return <DateRangeSelector value={value} onChange={onChange} options={options} />;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}
