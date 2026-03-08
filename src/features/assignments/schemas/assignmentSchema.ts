import { z } from 'zod';

export const driverVehicleAssignmentSchema = z.object({
  driver_id: z.string().min(1, 'נהג הוא שדה חובה'),
  vehicle_id: z.string().min(1, 'רכב הוא שדה חובה'),
  start_date: z.string().min(1, 'תאריך התחלה הוא שדה חובה'),
  notes: z.string().optional().or(z.literal('')),
});

export type DriverVehicleAssignmentFormData = z.infer<typeof driverVehicleAssignmentSchema>;

export const publicRightVehicleAssignmentSchema = z.object({
  public_right_id: z.string().min(1, 'זכות ציבורית היא שדה חובה'),
  vehicle_id: z.string().min(1, 'רכב הוא שדה חובה'),
  start_date: z.string().min(1, 'תאריך התחלה הוא שדה חובה'),
  notes: z.string().optional().or(z.literal('')),
});

export type PublicRightVehicleAssignmentFormData = z.infer<typeof publicRightVehicleAssignmentSchema>;

export const publicRightRenterAssignmentSchema = z.object({
  public_right_id: z.string().min(1, 'זכות ציבורית היא שדה חובה'),
  renter_id: z.string().min(1, 'שוכר היא שדה חובה'),
  start_date: z.string().min(1, 'תאריך התחלה הוא שדה חובה'),
  notes: z.string().optional().or(z.literal('')),
});

export type PublicRightRenterAssignmentFormData = z.infer<typeof publicRightRenterAssignmentSchema>;

export const closeAssignmentSchema = z.object({
  end_date: z.string().min(1, 'תאריך סיום הוא שדה חובה'),
});

export type CloseAssignmentFormData = z.infer<typeof closeAssignmentSchema>;
