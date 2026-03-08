import { z } from 'zod';

export const vehicleSchema = z.object({
  license_plate: z.string().min(1, 'מספר רכב הוא שדה חובה'),
  make: z.string().optional().or(z.literal('')),
  model: z.string().optional().or(z.literal('')),
  year: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^\d+$/.test(val), 'שנה חייבת להיות מספר')
    .refine((val) => !val || (Number(val) >= 1900 && Number(val) <= 2100), 'שנה חייבת להיות בין 1900 ל-2100'),
  color: z.string().optional().or(z.literal('')),
  vin: z.string().optional().or(z.literal('')),
  status: z.enum(['available', 'rented', 'maintenance', 'inactive']),
  notes: z.string().optional().or(z.literal('')),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
