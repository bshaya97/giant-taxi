import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateField } from '@/components/ui/DateField';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';
import {
  closeAssignmentSchema,
  type CloseAssignmentFormData,
} from '../schemas/assignmentSchema';

type CloseAssignmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CloseAssignmentFormData) => void;
  isSubmitting: boolean;
};

export function CloseAssignmentDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CloseAssignmentDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CloseAssignmentFormData>({
    resolver: zodResolver(closeAssignmentSchema),
  });

  if (!isOpen) return null;

  const handleConfirm = handleSubmit((data) => {
    onSubmit(data);
    reset();
  });

  return (
    <dialog open className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-96 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">{he.assignments.closeAssignment}</h2>

        <div className="mb-6">
          <DateField
            id="end_date"
            label={he.assignments.endDate}
            error={errors.end_date?.message}
            {...register('end_date')}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
            {he.common.cancel}
          </Button>
          <Button variant="primary" size="md" onClick={handleConfirm} isLoading={isSubmitting}>
            {he.common.save}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
