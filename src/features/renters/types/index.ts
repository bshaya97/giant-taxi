import type { Database } from '@/lib/database.types';

export type Renter = Database['public']['Tables']['public_right_renters']['Row'];
export type RenterInsert = Database['public']['Tables']['public_right_renters']['Insert'];
export type RenterUpdate = Database['public']['Tables']['public_right_renters']['Update'];
