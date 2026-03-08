import { z } from 'zod';

export const publicRightSchema = z.object({
  right_number: z.string().min(1, 'מספר הזכות הוא שדה חובה'),
  status: z.enum(['available', 'assigned_to_company_vehicle', 'rented_to_private', 'frozen']),
  notes: z.string().optional().or(z.literal('')),
});

export type PublicRightFormData = z.infer<typeof publicRightSchema>;
