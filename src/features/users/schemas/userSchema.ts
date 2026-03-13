import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('כתובת דוא״ל לא תקינה'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  full_name: z.string().min(1, 'שם מלא הוא שדה חובה'),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  full_name: z.string().min(1, 'שם מלא הוא שדה חובה'),
  role: z.enum(['admin', 'office']),
  is_active: z.enum(['true', 'false']),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;
