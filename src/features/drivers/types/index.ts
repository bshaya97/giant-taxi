import type { Database } from '@/lib/database.types';

export type Driver = Database['public']['Tables']['drivers']['Row'];
export type DriverInsert = Database['public']['Tables']['drivers']['Insert'];
export type DriverUpdate = Database['public']['Tables']['drivers']['Update'];
