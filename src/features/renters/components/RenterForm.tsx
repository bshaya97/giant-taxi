import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { he } from '@/i18n/he';
import { renterSchema, type RenterFormData } from '../schemas/renterSchema';
import type { Renter } from '../types';

type RenterFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RenterFormData) => void;
  isSubmitting: boolean;
  renter?: Renter | null;
};

const statusOptions = [
  { value: 'active', label: he.renters.statusActive },
  { value: 'inactive', label: he.renters.statusInactive },
];

export function RenterForm({ isOpen, onClose, onSubmit, isSubmitting, renter }: RenterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RenterFormData>({
    resolver: zodResolver(renterSchema),
    defaultValues: {
      status: 'active',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (renter) {
        reset({
          full_name: renter.full_name,
          id_number: renter.id_number,
          phone: renter.phone ?? '',
          email: renter.email ?? '',
          company_name: renter.company_name ?? '',
          status: renter.status,
          notes: renter.notes ?? '',
        });
      } else {
        reset({
          full_name: '',
          id_number: '',
          phone: '',
          email: '',
          company_name: '',
          status: 'active',
          notes: '',
        });
      }
    }
  }, [isOpen, renter, reset]);

  const title = renter ? he.common.edit : he.renters.addRenter;

  return (
    <FormDialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <FormField
        id="full_name"
        label={he.renters.fullName}
        error={errors.full_name?.message}
        {...register('full_name')}
      />
      <FormField
        id="id_number"
        label={he.renters.idNumber}
        error={errors.id_number?.message}
        dir="ltr"
        {...register('id_number')}
      />
      <FormField
        id="phone"
        label={he.renters.phone}
        error={errors.phone?.message}
        type="tel"
        dir="ltr"
        {...register('phone')}
      />
      <FormField
        id="email"
        label={he.renters.email}
        error={errors.email?.message}
        type="email"
        dir="ltr"
        {...register('email')}
      />
      <FormField
        id="company_name"
        label={he.renters.companyName}
        error={errors.company_name?.message}
        {...register('company_name')}
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
