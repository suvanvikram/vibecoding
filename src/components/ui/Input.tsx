import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">{icon}</span>}
        <input
          ref={ref}
          className={`w-full bg-bg-elevated border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200 focus:border-success/50 focus:ring-2 focus:ring-success/10 outline-none ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  )
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className = '', children, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={`w-full bg-bg-elevated border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary transition-all duration-200 focus:border-success/50 focus:ring-2 focus:ring-success/10 outline-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
);
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full bg-bg-elevated border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200 focus:border-success/50 focus:ring-2 focus:ring-success/10 outline-none resize-none ${className}`}
        {...props}
      />
    </div>
  )
);
Textarea.displayName = 'Textarea';
