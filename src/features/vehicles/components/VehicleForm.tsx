import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { he } from '@/i18n/he';
import { vehicleSchema, type VehicleFormData } from '../schemas/vehicleSchema';
import type { Vehicle } from '../types';
import { usePublicRights } from '@/features/public-rights/hooks/usePublicRights';

type VehicleFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => void;
  isSubmitting: boolean;
  vehicle?: Vehicle | null;
};

export function VehicleForm({ isOpen, onClose, onSubmit, isSubmitting, vehicle }: VehicleFormProps) {
  const { data: publicRights = [] } = usePublicRights();
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        form.reset({
          license_plate: vehicle.license_plate,
          public_taxi_right_id: vehicle.public_taxi_right_id || '',
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year ? String(vehicle.year) : '',
          color: vehicle.color || '',
          vin: vehicle.vin || '',
          status: vehicle.status,
          notes: vehicle.notes || '',
        });
      } else {
        form.reset({
          license_plate: '',
          public_taxi_right_id: '',
          make: '',
          model: '',
          year: '',
          color: '',
          vin: '',
          status: 'available',
          notes: '',
        });
      }
    }
  }, [isOpen, vehicle, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <FormDialog
      title={vehicle ? he.common.edit : he.common.create}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormField
        label={he.vehicles.licensePlate}
        error={form.formState.errors.license_plate?.message}
        {...form.register('license_plate')}
      />

      <SelectField
        label={he.vehicles.publicRight}
        error={form.formState.errors.public_taxi_right_id?.message}
        options={publicRights.map((pr) => ({
          value: pr.id,
          label: pr.right_number,
        }))}
        {...form.register('public_taxi_right_id')}
      />

      <FormField
        label={he.vehicles.make}
        error={form.formState.errors.make?.message}
        {...form.register('make')}
      />

      <FormField
        label={he.vehicles.model}
        error={form.formState.errors.model?.message}
        {...form.register('model')}
      />

      <FormField
        label={he.vehicles.year}
        type="number"
        error={form.formState.errors.year?.message}
        {...form.register('year')}
      />

      <FormField
        label={he.vehicles.color}
        error={form.formState.errors.color?.message}
        {...form.register('color')}
      />

      <FormField
        label={he.vehicles.vin}
        error={form.formState.errors.vin?.message}
        {...form.register('vin')}
      />

      <SelectField
        label={he.common.status}
        error={form.formState.errors.status?.message}
        options={[
          { value: 'available', label: he.vehicles.statusAvailable },
          { value: 'rented', label: he.vehicles.statusRented },
          { value: 'maintenance', label: he.vehicles.statusMaintenance },
          { value: 'inactive', label: he.vehicles.statusInactive },
        ]}
        {...form.register('status')}
      />

      <FormField
        label={he.common.notes}
        error={form.formState.errors.notes?.message}
        {...form.register('notes')}
      />
    </FormDialog>
  );
}
