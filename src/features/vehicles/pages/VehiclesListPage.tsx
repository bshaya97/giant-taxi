import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { he } from '@/i18n/he';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '../hooks/useVehicles';
import { VehicleTable } from '../components/VehicleTable';
import { VehicleForm } from '../components/VehicleForm';
import type { VehicleFormData } from '../schemas/vehicleSchema';
import type { Vehicle } from '../types';

export function VehiclesListPage() {
  const { data: vehicles = [], isLoading, error } = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  const handleCreate = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: VehicleFormData) => {
    const payload = {
      ...data,
      make: data.make || null,
      model: data.model || null,
      year: data.year ? Number(data.year) : null,
      color: data.color || null,
      vin: data.vin || null,
      notes: data.notes || null,
    };

    if (editingVehicle) {
      updateVehicle.mutate(
        { id: editingVehicle.id, data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast.success('הרכב עודכן בהצלחה');
          },
          onError: () => toast.error('שגיאה בעדכון הרכב'),
        },
      );
    } else {
      createVehicle.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('הרכב נוצר בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת הרכב'),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingVehicle) return;
    deleteVehicle.mutate(deletingVehicle.id, {
      onSuccess: () => {
        setDeletingVehicle(null);
        toast.success('הרכב נמחק בהצלחה');
      },
      onError: () => toast.error('שגיאה במחיקת הרכב'),
    });
  };

  return (
    <div>
      <PageHeader
        title={he.vehicles.title}
        actionLabel={he.vehicles.addVehicle}
        onAction={handleCreate}
      />

      <VehicleTable
        data={vehicles}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={setDeletingVehicle}
      />

      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createVehicle.isPending || updateVehicle.isPending}
        vehicle={editingVehicle}
      />

      <ConfirmDialog
        title={he.common.delete}
        message={he.common.confirmDelete}
        isOpen={!!deletingVehicle}
        onConfirm={handleDelete}
        onCancel={() => setDeletingVehicle(null)}
        isDestructive
        isLoading={deleteVehicle.isPending}
      />
    </div>
  );
}
