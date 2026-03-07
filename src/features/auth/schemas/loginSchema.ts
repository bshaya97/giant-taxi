import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('כתובת דוא״ל לא תקינה'),
  password: z.string().min(1, 'יש להזין סיסמה'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
