import { forwardRef, type SelectHTMLAttributes } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label: string;
  error?: string;
  options: Option[];
  placeholder?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, id, className = '', ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
