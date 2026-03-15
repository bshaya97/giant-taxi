import { Button } from './Button';

type PageHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
