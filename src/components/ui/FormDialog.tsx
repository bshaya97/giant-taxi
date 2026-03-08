import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button';
import { he } from '@/i18n/he';

type FormDialogProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  children: ReactNode;
};

export function FormDialog({
  title,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  children,
}: FormDialogProps) {
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
      onClose={onClose}
      className="w-full max-w-lg rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/50"
    >
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {he.common.cancel}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {he.common.save}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
