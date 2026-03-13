import { z } from 'zod';

export const driverSchema = z.object({
  full_name: z.string().min(1, 'שם מלא הוא שדה חובה'),
  id_number: z.string().min(1, 'תעודת זהות היא שדה חובה'),
  vehicle_id: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('כתובת דוא״ל לא תקינה').optional().or(z.literal('')),
  license_number: z.string().optional().or(z.literal('')),
  license_expiry: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  engagement_type: z.enum(['licensed_dealer', 'payroll']),
  notes: z.string().optional().or(z.literal('')),
});

export type DriverFormData = z.infer<typeof driverSchema>;
