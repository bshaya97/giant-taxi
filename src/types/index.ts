export type { UserRole, DriverStatus, DriverEngagementType, VehicleStatus, PublicRightStatus, RenterStatus, ChargeType, ChargeStatus } from '@/lib/database.types';

export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'office';
  is_active: boolean;
};
