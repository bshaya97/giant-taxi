import type { Database } from '@/lib/database.types';

export type PublicRight = Database['public']['Tables']['public_rights']['Row'];
export type PublicRightInsert = Database['public']['Tables']['public_rights']['Insert'];
export type PublicRightUpdate = Database['public']['Tables']['public_rights']['Update'];
