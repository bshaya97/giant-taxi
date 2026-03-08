import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/DateField';
import { FormField } from '@/components/ui/FormField';
import { he } from '@/i18n/he';
import { usePublicRights } from '@/features/public-rights/hooks/usePublicRights';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import {
  publicRightVehicleAssignmentSchema,
  type PublicRightVehicleAssignmentFormData,
} from '../schemas/assignmentSchema';

type PublicRightVehicleAssignmentFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PublicRightVehicleAssignmentFormData) => void;
  isSubmitting: boolean;
};

export function PublicRightVehicleAssignmentForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: PublicRightVehicleAssignmentFormProps) {
  const { data: publicRights = [] } = usePublicRights();
  const { data: vehicles = [] } = useVehicles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublicRightVehicleAssignmentFormData>({
    resolver: zodResolver(publicRightVehicleAssignmentSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        public_right_id: '',
        vehicle_id: '',
        start_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [isOpen, reset]);

  const publicRightOptions = publicRights.map((pr) => ({
    value: pr.id,
    label: pr.right_number,
  }));

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id,
    label: vehicle.license_plate,
  }));

  return (
    <FormDialog
      title={he.assignments.publicRightVehicle}
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
        id="vehicle_id"
        label={he.nav.vehicles}
        options={vehicleOptions}
        error={errors.vehicle_id?.message}
        {...register('vehicle_id')}
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
