import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Vehicle, VehicleInsert, VehicleUpdate } from '../types';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, public_rights(right_number)')
        .order('license_plate', { ascending: true });

      if (error) throw error;
      return data as Vehicle[];
    },
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, public_rights(right_number)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Vehicle;
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VehicleInsert) => {
      const payload = {
        ...data,
        year: data.year ? Number(data.year) : null,
        make: data.make || null,
        model: data.model || null,
        color: data.color || null,
        vin: data.vin || null,
        notes: data.notes || null,
      };

      const { data: result, error } = await supabase.from('vehicles').insert(payload).select().single();

      if (error) throw error;
      return result as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VehicleUpdate }) => {
      const payload = {
        ...data,
        year: data.year ? Number(data.year) : null,
      };

      const { data: result, error } = await supabase
        .from('vehicles')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
