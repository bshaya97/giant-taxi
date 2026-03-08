import { z } from 'zod';

const baseChargeSchema = z.object({
  charge_type: z.enum(['vehicle_rental', 'public_right_rental']),
  charge_status: z.enum(['draft', 'open', 'paid', 'cancelled']),
  amount: z.string().min(1, 'סכום הוא שדה חובה'),
  currency: z.string().default('ILS'),
  description: z.string().optional().or(z.literal('')),
  period_start: z.string().optional().or(z.literal('')),
  period_end: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export const vehicleRentalChargeSchema = baseChargeSchema.extend({
  charge_type: z.literal('vehicle_rental'),
  driver_id: z.string().min(1, 'נהג הוא שדה חובה'),
  vehicle_id: z.string().min(1, 'רכב הוא שדה חובה'),
  renter_id: z.never().optional(),
  public_right_id: z.never().optional(),
});

export const publicRightRentalChargeSchema = baseChargeSchema.extend({
  charge_type: z.literal('public_right_rental'),
  renter_id: z.string().min(1, 'שוכר הוא שדה חובה'),
  public_right_id: z.string().min(1, 'זכות ציבורית היא שדה חובה'),
  driver_id: z.never().optional(),
  vehicle_id: z.never().optional(),
});

export const chargeSchema = z.union([
  vehicleRentalChargeSchema,
  publicRightRentalChargeSchema,
]);

export type ChargeFormData = z.infer<typeof chargeSchema>;
