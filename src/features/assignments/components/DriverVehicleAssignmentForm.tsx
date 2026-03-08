import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/DateField';
import { FormField } from '@/components/ui/FormField';
import { he } from '@/i18n/he';
import { useDrivers } from '@/features/drivers/hooks/useDrivers';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import {
  driverVehicleAssignmentSchema,
  type DriverVehicleAssignmentFormData,
} from '../schemas/assignmentSchema';

type DriverVehicleAssignmentFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DriverVehicleAssignmentFormData) => void;
  isSubmitting: boolean;
};

export function DriverVehicleAssignmentForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: DriverVehicleAssignmentFormProps) {
  const { data: drivers = [] } = useDrivers();
  const { data: vehicles = [] } = useVehicles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverVehicleAssignmentFormData>({
    resolver: zodResolver(driverVehicleAssignmentSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        driver_id: '',
        vehicle_id: '',
        start_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [isOpen, reset]);

  const driverOptions = drivers.map((driver) => ({
    value: driver.id,
    label: driver.full_name,
  }));

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id,
    label: vehicle.license_plate,
  }));

  return (
    <FormDialog
      title={he.assignments.driverVehicle}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <SelectField
        id="driver_id"
        label={he.nav.drivers}
        options={driverOptions}
        error={errors.driver_id?.message}
        {...register('driver_id')}
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
