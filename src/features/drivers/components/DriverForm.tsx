import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/DateField';
import { he } from '@/i18n/he';
import { driverSchema, type DriverFormData } from '../schemas/driverSchema';
import type { Driver } from '../types';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';

type DriverFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DriverFormData) => void;
  isSubmitting: boolean;
  driver?: Driver | null;
};

const statusOptions = [
  { value: 'active', label: he.drivers.statusActive },
  { value: 'inactive', label: he.drivers.statusInactive },
];

const engagementOptions = [
  { value: 'licensed_dealer', label: he.drivers.licensedDealer },
  { value: 'payroll', label: he.drivers.payroll },
];

export function DriverForm({ isOpen, onClose, onSubmit, isSubmitting, driver }: DriverFormProps) {
  const { data: vehicles = [] } = useVehicles();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      status: 'active',
      engagement_type: 'licensed_dealer',
    },
  });

  const selectedVehicleId = useWatch({ control, name: 'vehicle_id' });
  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId),
    [selectedVehicleId, vehicles]
  );
  const linkedPublicRight = useMemo(() => {
    if (!selectedVehicle) return null;
    const publicRights = (selectedVehicle as any).public_rights;
    return publicRights?.right_number || null;
  }, [selectedVehicle]);

  useEffect(() => {
    if (isOpen) {
      if (driver) {
        reset({
          full_name: driver.full_name,
          id_number: driver.id_number,
          vehicle_id: driver.vehicle_id ?? '',
          phone: driver.phone ?? '',
          email: driver.email ?? '',
          license_number: driver.license_number ?? '',
          license_expiry: driver.license_expiry ?? '',
          status: driver.status,
          engagement_type: driver.engagement_type,
          notes: driver.notes ?? '',
        });
      } else {
        reset({
          full_name: '',
          id_number: '',
          vehicle_id: '',
          phone: '',
          email: '',
          license_number: '',
          license_expiry: '',
          status: 'active',
          engagement_type: 'licensed_dealer',
          notes: '',
        });
      }
    }
  }, [isOpen, driver, reset]);

  const title = driver ? he.common.edit : he.drivers.addDriver;

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
        label={he.drivers.fullName}
        error={errors.full_name?.message}
        {...register('full_name')}
      />
      <FormField
        id="id_number"
        label={he.drivers.idNumber}
        error={errors.id_number?.message}
        dir="ltr"
        {...register('id_number')}
      />

      <SelectField
        id="vehicle_id"
        label={he.drivers.vehicle}
        error={errors.vehicle_id?.message}
        options={[
          { value: '', label: he.drivers.noVehicle },
          ...vehicles.map((v) => ({
            value: v.id,
            label: v.license_plate,
          })),
        ]}
        {...register('vehicle_id')}
      />

      {linkedPublicRight && (
        <FormField
          id="linked_public_right"
          label={he.drivers.linkedPublicRight}
          disabled
          value={linkedPublicRight}
        />
      )}

      <FormField
        id="phone"
        label={he.drivers.phone}
        error={errors.phone?.message}
        type="tel"
        dir="ltr"
        {...register('phone')}
      />
      <FormField
        id="email"
        label={he.drivers.email}
        error={errors.email?.message}
        type="email"
        dir="ltr"
        {...register('email')}
      />
      <FormField
        id="license_number"
        label={he.drivers.licenseNumber}
        error={errors.license_number?.message}
        dir="ltr"
        {...register('license_number')}
      />
      <DateField
        id="license_expiry"
        label={he.drivers.licenseExpiry}
        error={errors.license_expiry?.message}
        {...register('license_expiry')}
      />
      <SelectField
        id="engagement_type"
        label={he.drivers.engagementType}
        options={engagementOptions}
        error={errors.engagement_type?.message}
        {...register('engagement_type')}
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
