import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Driver, DriverInsert, DriverUpdate } from '../types';

const QUERY_KEY = 'drivers';

export function useDrivers() {
  return useQuery<Driver[], Error>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*, vehicles(license_plate, public_taxi_right_id, public_rights(right_number))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDriver(id: string) {
  return useQuery<Driver, Error>({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*, vehicles(license_plate, public_taxi_right_id, public_rights(right_number))')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driver: DriverInsert) => {
      const { data, error } = await supabase
        .from('drivers')
        .insert(driver)
        .select()
        .single();
      if (error) throw error;

      // Write assignment history if vehicle_id provided
      if (driver.vehicle_id) {
        const { error: assignError } = await supabase.from('driver_vehicle_assignments').insert({
          driver_id: data.id,
          vehicle_id: driver.vehicle_id,
          start_date: new Date().toISOString().split('T')[0],
          is_active: true,
        });
        if (assignError) throw assignError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DriverUpdate }) => {
      // Get current driver to check if vehicle_id is changing
      const { data: currentDriver, error: fetchError } = await supabase
        .from('drivers')
        .select('vehicle_id')
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;

      const { data: updated, error } = await supabase
        .from('drivers')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      // Handle assignment history if vehicle_id changed
      if (data.vehicle_id !== currentDriver.vehicle_id) {
        // Close old active assignment if exists
        if (currentDriver.vehicle_id) {
          const { error: closeError } = await supabase
            .from('driver_vehicle_assignments')
            .update({ end_date: new Date().toISOString().split('T')[0], is_active: false })
            .eq('driver_id', id)
            .eq('is_active', true);
          if (closeError) throw closeError;
        }

        // Create new active assignment if new vehicle_id provided
        if (data.vehicle_id) {
          const { error: assignError } = await supabase.from('driver_vehicle_assignments').insert({
            driver_id: id,
            vehicle_id: data.vehicle_id as string,
            start_date: new Date().toISOString().split('T')[0],
            is_active: true,
          });
          if (assignError) throw assignError;
        }
      }

      return updated;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('drivers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
