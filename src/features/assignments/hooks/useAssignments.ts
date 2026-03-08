import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  DriverVehicleAssignmentInsert,
  PublicRightVehicleAssignmentInsert,
  PublicRightRenterAssignmentInsert,
  DriverVehicleAssignmentWithNames,
  PublicRightVehicleAssignmentWithNames,
  PublicRightRenterAssignmentWithNames,
} from '../types';

// ============================================================
// Driver ↔ Vehicle Assignments
// ============================================================

export function useDriverVehicleAssignments() {
  return useQuery<DriverVehicleAssignmentWithNames[], Error>({
    queryKey: ['driverVehicleAssignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_vehicle_assignments')
        .select(
          `
          *,
          drivers:driver_id(full_name),
          vehicles:vehicle_id(license_plate)
        `
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any) || [];
    },
  });
}

export function useCreateDriverVehicleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: DriverVehicleAssignmentInsert) => {
      const { data, error } = await supabase
        .from('driver_vehicle_assignments')
        .insert(assignment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverVehicleAssignments'] });
    },
  });
}

export function useCloseDriverVehicleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, end_date }: { id: string; end_date: string }) => {
      const { data, error } = await supabase
        .from('driver_vehicle_assignments')
        .update({ end_date, is_active: false })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverVehicleAssignments'] });
    },
  });
}

// ============================================================
// Public Right ↔ Vehicle Assignments
// ============================================================

export function usePublicRightVehicleAssignments() {
  return useQuery<PublicRightVehicleAssignmentWithNames[], Error>({
    queryKey: ['publicRightVehicleAssignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_right_vehicle_assignments')
        .select(
          `
          *,
          public_rights:public_right_id(right_number),
          vehicles:vehicle_id(license_plate)
        `
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any) || [];
    },
  });
}

export function useCreatePublicRightVehicleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: PublicRightVehicleAssignmentInsert) => {
      const { data, error } = await supabase
        .from('public_right_vehicle_assignments')
        .insert(assignment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicRightVehicleAssignments'] });
    },
  });
}

export function useClosePublicRightVehicleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, end_date }: { id: string; end_date: string }) => {
      const { data, error } = await supabase
        .from('public_right_vehicle_assignments')
        .update({ end_date, is_active: false })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicRightVehicleAssignments'] });
    },
  });
}

// ============================================================
// Public Right ↔ Renter Assignments
// ============================================================

export function usePublicRightRenterAssignments() {
  return useQuery<PublicRightRenterAssignmentWithNames[], Error>({
    queryKey: ['publicRightRenterAssignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_right_renter_assignments')
        .select(
          `
          *,
          public_rights:public_right_id(right_number),
          public_right_renters:renter_id(full_name)
        `
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any) || [];
    },
  });
}

export function useCreatePublicRightRenterAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: PublicRightRenterAssignmentInsert) => {
      const { data, error } = await supabase
        .from('public_right_renter_assignments')
        .insert(assignment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicRightRenterAssignments'] });
    },
  });
}

export function useClosePublicRightRenterAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, end_date }: { id: string; end_date: string }) => {
      const { data, error } = await supabase
        .from('public_right_renter_assignments')
        .update({ end_date, is_active: false })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicRightRenterAssignments'] });
    },
  });
}
