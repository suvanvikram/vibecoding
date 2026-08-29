import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color = '#10B981', height = 'h-2', showLabel = false }: ProgressProps) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const isOver = value > max;

  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-bg-elevated rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: isOver ? '#F43F5E' : color }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1.5 text-xs">
          <span className="text-text-secondary">{`₹${value.toLocaleString('en-IN')}`}</span>
          <span className="text-text-tertiary">{`₹${max.toLocaleString('en-IN')}`}</span>
        </div>
      )}
    </div>
  );
}
