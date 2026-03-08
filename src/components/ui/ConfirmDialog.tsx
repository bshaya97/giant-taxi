import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { he } from '@/i18n/he';

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

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl backdrop:bg-black/50"
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{message}</p>

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
