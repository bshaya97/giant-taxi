import type { Database } from '@/lib/database.types';

export type Charge = Database['public']['Tables']['charges']['Row'];
export type ChargeInsert = Database['public']['Tables']['charges']['Insert'];
export type ChargeUpdate = Database['public']['Tables']['charges']['Update'];
