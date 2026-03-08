import { z } from 'zod';

export const renterSchema = z.object({
  full_name: z.string().min(1, 'שם מלא הוא שדה חובה'),
  id_number: z.string().min(1, 'תעודת זהות היא שדה חובה'),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('כתובת דוא״ל לא תקינה').optional().or(z.literal('')),
  company_name: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  notes: z.string().optional().or(z.literal('')),
});

export type RenterFormData = z.infer<typeof renterSchema>;
