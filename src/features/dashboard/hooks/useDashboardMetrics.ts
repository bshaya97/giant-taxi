import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useTotalDrivers() {
  return useQuery<number, Error>({
    queryKey: ['dashboardMetrics', 'totalDrivers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useTotalVehicles() {
  return useQuery<number, Error>({
    queryKey: ['dashboardMetrics', 'totalVehicles'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useTotalPublicRights() {
  return useQuery<number, Error>({
    queryKey: ['dashboardMetrics', 'totalPublicRights'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('public_rights')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useAvailablePublicRights() {
  return useQuery<number, Error>({
    queryKey: ['dashboardMetrics', 'availablePublicRights'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('public_rights')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useAssignedVehicles() {
  return useQuery<number, Error>({
    queryKey: ['dashboardMetrics', 'assignedVehicles'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('driver_vehicle_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useOpenCharges() {
  return useQuery<number, Error>({
    queryKey: ['dashboardMetrics', 'openCharges'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('charges')
        .select('*', { count: 'exact', head: true })
        .eq('charge_status', 'open');
      if (error) throw error;
      return count || 0;
    },
  });
}
