import { forwardRef, type InputHTMLAttributes } from 'react';

type DateFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
};

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          type="date"
          dir="ltr"
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

DateField.displayName = 'DateField';
