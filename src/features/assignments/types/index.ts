import type { Database } from '@/lib/database.types';

export type DriverVehicleAssignment = Database['public']['Tables']['driver_vehicle_assignments']['Row'];
export type DriverVehicleAssignmentInsert = Database['public']['Tables']['driver_vehicle_assignments']['Insert'];
export type DriverVehicleAssignmentUpdate = Database['public']['Tables']['driver_vehicle_assignments']['Update'];

export type PublicRightVehicleAssignment = Database['public']['Tables']['public_right_vehicle_assignments']['Row'];
export type PublicRightVehicleAssignmentInsert = Database['public']['Tables']['public_right_vehicle_assignments']['Insert'];
export type PublicRightVehicleAssignmentUpdate = Database['public']['Tables']['public_right_vehicle_assignments']['Update'];

export type PublicRightRenterAssignment = Database['public']['Tables']['public_right_renter_assignments']['Row'];
export type PublicRightRenterAssignmentInsert = Database['public']['Tables']['public_right_renter_assignments']['Insert'];
export type PublicRightRenterAssignmentUpdate = Database['public']['Tables']['public_right_renter_assignments']['Update'];

// Extended types with related entity names for display
export type DriverVehicleAssignmentWithNames = DriverVehicleAssignment & {
  drivers?: { full_name: string };
  vehicles?: { license_plate: string };
};

export type PublicRightVehicleAssignmentWithNames = PublicRightVehicleAssignment & {
  public_rights?: { right_number: string };
  vehicles?: { license_plate: string };
};

export type PublicRightRenterAssignmentWithNames = PublicRightRenterAssignment & {
  public_rights?: { right_number: string };
  public_right_renters?: { full_name: string };
};
