import type { Database } from '@/lib/database.types';

export type User = Database['public']['Tables']['app_users']['Row'];
export type UserInsert = Database['public']['Tables']['app_users']['Insert'];
export type UserUpdate = Database['public']['Tables']['app_users']['Update'];
