import { type ReactNode } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatINR } from '@/utils/finance';

const tooltipStyle = {
  backgroundColor: '#0F1117',
  border: '1px solid #262B38',
  borderRadius: '12px',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
};

const labelStyle = { color: '#8B92A5', fontSize: '11px', marginBottom: '4px' };

const axisStyle = { fontSize: '11px', fill: '#5C6273' };

interface SparklineProps {
  data: { value: number }[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = '#10B981', height = 40 }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#spark-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface TrendChartProps {
  data: { month: string; income: number; expenses: number; savings: number }[];
  mode: 'expenses' | 'income' | 'savings';
}

export function TrendChart({ data, mode }: TrendChartProps) {
  const config = {
    expenses: { key: 'expenses', color: '#F43F5E', label: 'Expenses' },
    income: { key: 'income', color: '#10B981', label: 'Income' },
    savings: { key: 'savings', color: '#3B82F6', label: 'Savings' },
  };
  const { key, color, label } = config[mode];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`trend-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F232E" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v, true)} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={labelStyle}
          formatter={((v: number | string) => [formatINR(Number(v)), label]) as never}
        />
        <Area type="monotone" dataKey={key} stroke={color} strokeWidth={2.5} fill={`url(#trend-${key})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface IncomeExpenseBarProps {
  data: { month: string; income: number; expenses: number }[];
}

export function IncomeExpenseBarChart({ data }: IncomeExpenseBarProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F232E" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v, true)} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={labelStyle}
          formatter={((v: number | string, name: number | string) => [formatINR(Number(v)), name === 'income' ? 'Income' : 'Expenses']) as never}
        />
        <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={32} />
        <Bar dataKey="expenses" fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DonutChartProps {
  data: { name: string; value: number; percentage: number }[];
  colors: Record<string, string>;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, colors, centerLabel, centerValue }: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={colors[entry.name] || '#64748B'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={labelStyle}
            formatter={((v: number | string, _name: number | string, entry: { payload?: { percentage?: number } }) => [
              `${formatINR(Number(v))} (${entry.payload?.percentage?.toFixed(1) || 0}%)`,
            ]) as never}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && <span className="text-2xl font-bold text-text-primary">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-text-secondary mt-1">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

interface PortfolioChartProps {
  data: { month: string; value: number }[];
  color?: string;
}

export function PortfolioChart({ data, color = '#3B82F6' }: PortfolioChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolio-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F232E" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v, true)} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={labelStyle}
          formatter={((v: number | string) => [formatINR(Number(v)), 'Portfolio Value']) as never}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#portfolio-grad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface NetWorthChartProps {
  data: { month: string; value: number }[];
  color?: string;
}

export function NetWorthChart({ data, color = '#8B5CF6' }: NetWorthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="networth-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F232E" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v, true)} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={labelStyle}
          formatter={((v: number | string) => [formatINR(Number(v)), 'Net Worth']) as never}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#networth-grad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface BarLineChartProps {
  data: { month: string; income: number; expenses: number; savings: number }[];
}

export function SavingsTrendChart({ data }: BarLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F232E" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v, true)} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={labelStyle}
          formatter={((v: number | string, name: number | string) => [formatINR(Number(v)), String(name)]) as never}
        />
        <Bar dataKey="savings" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChartContainer({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
