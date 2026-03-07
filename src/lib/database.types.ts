export type UserRole = 'admin' | 'office';
export type DriverStatus = 'active' | 'inactive';
export type DriverEngagementType = 'licensed_dealer' | 'payroll';
export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'inactive';
export type PublicRightStatus = 'available' | 'assigned_to_company_vehicle' | 'rented_to_private' | 'frozen';
export type RenterStatus = 'active' | 'inactive';
export type ChargeType = 'vehicle_rental' | 'public_right_rental';
export type ChargeStatus = 'draft' | 'open' | 'paid' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      app_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          full_name?: string;
          role?: UserRole;
          is_active?: boolean;
        };
      };
      drivers: {
        Row: {
          id: string;
          full_name: string;
          id_number: string;
          phone: string | null;
          email: string | null;
          license_number: string | null;
          license_expiry: string | null;
          status: DriverStatus;
          engagement_type: DriverEngagementType;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          id_number: string;
          phone?: string | null;
          email?: string | null;
          license_number?: string | null;
          license_expiry?: string | null;
          status?: DriverStatus;
          engagement_type: DriverEngagementType;
          notes?: string | null;
        };
        Update: {
          full_name?: string;
          id_number?: string;
          phone?: string | null;
          email?: string | null;
          license_number?: string | null;
          license_expiry?: string | null;
          status?: DriverStatus;
          engagement_type?: DriverEngagementType;
          notes?: string | null;
        };
      };
      vehicles: {
        Row: {
          id: string;
          license_plate: string;
          make: string | null;
          model: string | null;
          year: number | null;
          color: string | null;
          vin: string | null;
          status: VehicleStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          license_plate: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          color?: string | null;
          vin?: string | null;
          status?: VehicleStatus;
          notes?: string | null;
        };
        Update: {
          license_plate?: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          color?: string | null;
          vin?: string | null;
          status?: VehicleStatus;
          notes?: string | null;
        };
      };
      public_rights: {
        Row: {
          id: string;
          right_number: string;
          status: PublicRightStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          right_number: string;
          status?: PublicRightStatus;
          notes?: string | null;
        };
        Update: {
          right_number?: string;
          status?: PublicRightStatus;
          notes?: string | null;
        };
      };
      public_right_renters: {
        Row: {
          id: string;
          full_name: string;
          id_number: string;
          phone: string | null;
          email: string | null;
          company_name: string | null;
          status: RenterStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          id_number: string;
          phone?: string | null;
          email?: string | null;
          company_name?: string | null;
          status?: RenterStatus;
          notes?: string | null;
        };
        Update: {
          full_name?: string;
          id_number?: string;
          phone?: string | null;
          email?: string | null;
          company_name?: string | null;
          status?: RenterStatus;
          notes?: string | null;
        };
      };
      driver_vehicle_assignments: {
        Row: {
          id: string;
          driver_id: string;
          vehicle_id: string;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          driver_id: string;
          vehicle_id: string;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          notes?: string | null;
          created_by?: string | null;
        };
        Update: {
          end_date?: string | null;
          is_active?: boolean;
          notes?: string | null;
        };
      };
      public_right_vehicle_assignments: {
        Row: {
          id: string;
          public_right_id: string;
          vehicle_id: string;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          public_right_id: string;
          vehicle_id: string;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          notes?: string | null;
          created_by?: string | null;
        };
        Update: {
          end_date?: string | null;
          is_active?: boolean;
          notes?: string | null;
        };
      };
      public_right_renter_assignments: {
        Row: {
          id: string;
          public_right_id: string;
          renter_id: string;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          public_right_id: string;
          renter_id: string;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          notes?: string | null;
          created_by?: string | null;
        };
        Update: {
          end_date?: string | null;
          is_active?: boolean;
          notes?: string | null;
        };
      };
      charges: {
        Row: {
          id: string;
          charge_type: ChargeType;
          charge_status: ChargeStatus;
          amount: number;
          currency: string;
          description: string | null;
          period_start: string | null;
          period_end: string | null;
          driver_id: string | null;
          vehicle_id: string | null;
          renter_id: string | null;
          public_right_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          charge_type: ChargeType;
          charge_status?: ChargeStatus;
          amount: number;
          currency?: string;
          description?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          driver_id?: string | null;
          vehicle_id?: string | null;
          renter_id?: string | null;
          public_right_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
        };
        Update: {
          charge_status?: ChargeStatus;
          amount?: number;
          description?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          notes?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      driver_status: DriverStatus;
      driver_engagement_type: DriverEngagementType;
      vehicle_status: VehicleStatus;
      public_right_status: PublicRightStatus;
      renter_status: RenterStatus;
      charge_type: ChargeType;
      charge_status: ChargeStatus;
    };
  };
}
