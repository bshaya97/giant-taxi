import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { he } from '@/i18n/he';
import { AlertTriangle, Info } from 'lucide-react';

type ConfirmDialogProps = {
  title: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
};

export function ConfirmDialog({
  title,
  message,
  isOpen,
  onConfirm,
  onCancel,
  isDestructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const Icon = isDestructive ? AlertTriangle : Info;
  const iconBg = isDestructive ? 'bg-red-100' : 'bg-blue-100';
  const iconColor = isDestructive ? 'text-red-600' : 'text-blue-600';

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`rounded-full ${iconBg} p-3 mb-4`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {he.common.cancel}
        </Button>
        <Button
          type="button"
          variant={isDestructive ? 'danger' : 'primary'}
          isLoading={isLoading}
          onClick={onConfirm}
        >
          {he.common.yes}
        </Button>
      </div>
    </dialog>
  );
}
