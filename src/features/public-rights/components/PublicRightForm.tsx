import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { he } from '@/i18n/he';
import { publicRightSchema, type PublicRightFormData } from '../schemas/publicRightSchema';
import type { PublicRight } from '../types';

type PublicRightFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PublicRightFormData) => void;
  isSubmitting: boolean;
  publicRight?: PublicRight | null;
};

const statusOptions = [
  { value: 'available', label: he.publicRights.statusAvailable },
  { value: 'assigned_to_company_vehicle', label: he.publicRights.statusAssignedToVehicle },
  { value: 'rented_to_private', label: he.publicRights.statusRentedToPrivate },
  { value: 'frozen', label: he.publicRights.statusFrozen },
];

export function PublicRightForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  publicRight,
}: PublicRightFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublicRightFormData>({
    resolver: zodResolver(publicRightSchema),
    defaultValues: {
      status: 'available',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (publicRight) {
        reset({
          right_number: publicRight.right_number,
          status: publicRight.status,
          notes: publicRight.notes ?? '',
        });
      } else {
        reset({
          right_number: '',
          status: 'available',
          notes: '',
        });
      }
    }
  }, [isOpen, publicRight, reset]);

  const title = publicRight ? he.common.edit : he.publicRights.addRight;

  return (
    <FormDialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <FormField
        id="right_number"
        label={he.publicRights.rightNumber}
        error={errors.right_number?.message}
        dir="ltr"
        {...register('right_number')}
      />
      <SelectField
        id="status"
        label={he.common.status}
        options={statusOptions}
        error={errors.status?.message}
        {...register('status')}
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
