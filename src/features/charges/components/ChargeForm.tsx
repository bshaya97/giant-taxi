import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { DateField } from '@/components/ui/DateField';
import { he } from '@/i18n/he';
import { useDrivers } from '@/features/drivers/hooks/useDrivers';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import { usePublicRights } from '@/features/public-rights/hooks/usePublicRights';
import { useRenters } from '@/features/renters/hooks/useRenters';
import { chargeSchema, type ChargeFormData } from '../schemas/chargeSchema';
import type { Charge } from '../types';

type ChargeFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChargeFormData) => void;
  isSubmitting: boolean;
  charge?: Charge | null;
};

const chargeTypeOptions = [
  { value: 'vehicle_rental', label: he.charges.vehicleRental },
  { value: 'public_right_rental', label: he.charges.publicRightRental },
];

const chargeStatusOptions = [
  { value: 'draft', label: he.charges.statusDraft },
  { value: 'open', label: he.charges.statusOpen },
  { value: 'paid', label: he.charges.statusPaid },
  { value: 'cancelled', label: he.charges.statusCancelled },
];

export function ChargeForm({ isOpen, onClose, onSubmit, isSubmitting, charge }: ChargeFormProps) {
  const { data: drivers = [] } = useDrivers();
  const { data: vehicles = [] } = useVehicles();
  const { data: publicRights = [] } = usePublicRights();
  const { data: renters = [] } = useRenters();

  const [chargeType, setChargeType] = useState<'vehicle_rental' | 'public_right_rental'>(
    'vehicle_rental'
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(chargeSchema),
    defaultValues: {
      charge_status: 'draft',
      currency: 'ILS',
    },
  });

  const selectedChargeType = watch('charge_type') || chargeType;

  useEffect(() => {
    if (isOpen) {
      if (charge) {
        setChargeType(charge.charge_type as any);
        reset({
          charge_type: charge.charge_type,
          charge_status: charge.charge_status,
          amount: charge.amount.toString(),
          currency: charge.currency,
          description: charge.description ?? '',
          period_start: charge.period_start ?? '',
          period_end: charge.period_end ?? '',
          driver_id: charge.driver_id ?? '',
          vehicle_id: charge.vehicle_id ?? '',
          renter_id: charge.renter_id ?? '',
          public_right_id: charge.public_right_id ?? '',
          notes: charge.notes ?? '',
        });
      } else {
        setChargeType('vehicle_rental');
        reset({
          charge_type: 'vehicle_rental',
          charge_status: 'draft',
          amount: '',
          currency: 'ILS',
          description: '',
          period_start: '',
          period_end: '',
          driver_id: '',
          vehicle_id: '',
          renter_id: '',
          public_right_id: '',
          notes: '',
        });
      }
    }
  }, [isOpen, charge, reset]);

  const driverOptions = drivers.map((d) => ({ value: d.id, label: d.full_name }));
  const vehicleOptions = vehicles.map((v) => ({ value: v.id, label: v.license_plate }));
  const publicRightOptions = publicRights.map((pr) => ({ value: pr.id, label: pr.right_number }));
  const renterOptions = renters.map((r) => ({ value: r.id, label: r.full_name }));

  const getErrorMessage = (error: any): string | undefined => {
    if (!error) return undefined;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return undefined;
  };

  const title = charge ? he.common.edit : he.charges.addCharge;

  return (
    <FormDialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <SelectField
        id="charge_type"
        label={he.charges.chargeType}
        options={chargeTypeOptions}
        error={getErrorMessage(errors.charge_type)}
        {...register('charge_type')}
      />

      <SelectField
        id="charge_status"
        label={he.common.status}
        options={chargeStatusOptions}
        error={getErrorMessage(errors.charge_status)}
        {...register('charge_status')}
      />

      {selectedChargeType === 'vehicle_rental' && (
        <>
          <SelectField
            id="driver_id"
            label={he.nav.drivers}
            options={driverOptions}
            error={getErrorMessage(errors.driver_id)}
            {...register('driver_id')}
          />
          <SelectField
            id="vehicle_id"
            label={he.nav.vehicles}
            options={vehicleOptions}
            error={getErrorMessage(errors.vehicle_id)}
            {...register('vehicle_id')}
          />
        </>
      )}

      {selectedChargeType === 'public_right_rental' && (
        <>
          <SelectField
            id="public_right_id"
            label={he.nav.publicRights}
            options={publicRightOptions}
            error={getErrorMessage(errors.public_right_id)}
            {...register('public_right_id')}
          />
          <SelectField
            id="renter_id"
            label={he.nav.renters}
            options={renterOptions}
            error={getErrorMessage(errors.renter_id)}
            {...register('renter_id')}
          />
        </>
      )}

      <FormField
        id="amount"
        label={he.charges.amount}
        type="number"
        step="0.01"
        error={getErrorMessage(errors.amount)}
        dir="ltr"
        {...register('amount')}
      />

      <FormField
        id="currency"
        label="מטבע"
        error={getErrorMessage(errors.currency)}
        dir="ltr"
        {...register('currency')}
      />

      <FormField
        id="description"
        label="תיאור"
        error={getErrorMessage(errors.description)}
        {...register('description')}
      />

      <DateField
        id="period_start"
        label="תאריך התחלה"
        error={getErrorMessage(errors.period_start)}
        {...register('period_start')}
      />

      <DateField
        id="period_end"
        label="תאריך סיום"
        error={getErrorMessage(errors.period_end)}
        {...register('period_end')}
      />

      <FormField
        id="notes"
        label={he.common.notes}
        error={getErrorMessage(errors.notes)}
        {...register('notes')}
      />
    </FormDialog>
  );
}
