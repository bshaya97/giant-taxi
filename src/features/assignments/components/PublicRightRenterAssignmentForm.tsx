import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/DateField';
import { FormField } from '@/components/ui/FormField';
import { he } from '@/i18n/he';
import { usePublicRights } from '@/features/public-rights/hooks/usePublicRights';
import { useRenters } from '@/features/renters/hooks/useRenters';
import {
  publicRightRenterAssignmentSchema,
  type PublicRightRenterAssignmentFormData,
} from '../schemas/assignmentSchema';

type PublicRightRenterAssignmentFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PublicRightRenterAssignmentFormData) => void;
  isSubmitting: boolean;
};

export function PublicRightRenterAssignmentForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: PublicRightRenterAssignmentFormProps) {
  const { data: publicRights = [] } = usePublicRights();
  const { data: renters = [] } = useRenters();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublicRightRenterAssignmentFormData>({
    resolver: zodResolver(publicRightRenterAssignmentSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        public_right_id: '',
        renter_id: '',
        start_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [isOpen, reset]);

  const publicRightOptions = publicRights.map((pr) => ({
    value: pr.id,
    label: pr.right_number,
  }));

  const renterOptions = renters.map((renter) => ({
    value: renter.id,
    label: renter.full_name,
  }));

  return (
    <FormDialog
      title={he.assignments.publicRightRenter}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <SelectField
        id="public_right_id"
        label={he.nav.publicRights}
        options={publicRightOptions}
        error={errors.public_right_id?.message}
        {...register('public_right_id')}
      />
      <SelectField
        id="renter_id"
        label={he.nav.renters}
        options={renterOptions}
        error={errors.renter_id?.message}
        {...register('renter_id')}
      />
      <DateField
        id="start_date"
        label={he.assignments.startDate}
        error={errors.start_date?.message}
        {...register('start_date')}
      />
      <FormField
        id="notes"
        label={he.common.notes}
        error={errors.notes?.message}
        {...register('notes')}
      />
    </FormDialog>
  );
}
