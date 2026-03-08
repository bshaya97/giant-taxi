const variantClasses = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
} as const;

type StatusBadgeProps = {
  label: string;
  variant: keyof typeof variantClasses;
};

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
