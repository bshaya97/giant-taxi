import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { he } from '@/i18n/he';
import { useDrivers, useCreateDriver, useUpdateDriver, useDeleteDriver } from '../hooks/useDrivers';
import { DriverTable } from '../components/DriverTable';
import { DriverForm } from '../components/DriverForm';
import type { DriverFormData } from '../schemas/driverSchema';
import type { Driver } from '../types';

export function DriversListPage() {
  const { data: drivers = [], isLoading, error } = useDrivers();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  const handleCreate = () => {
    setEditingDriver(null);
    setIsFormOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: DriverFormData) => {
    const payload = {
      ...data,
      phone: data.phone || null,
      email: data.email || null,
      license_number: data.license_number || null,
      license_expiry: data.license_expiry || null,
      notes: data.notes || null,
    };

    if (editingDriver) {
      updateDriver.mutate(
        { id: editingDriver.id, data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast.success('הנהג עודכן בהצלחה');
          },
          onError: () => toast.error('שגיאה בעדכון הנהג'),
        },
      );
    } else {
      createDriver.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('הנהג נוצר בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת הנהג'),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingDriver) return;
    deleteDriver.mutate(deletingDriver.id, {
      onSuccess: () => {
        setDeletingDriver(null);
        toast.success('הנהג נמחק בהצלחה');
      },
      onError: () => toast.error('שגיאה במחיקת הנהג'),
    });
  };

  return (
    <div>
      <PageHeader
        title={he.drivers.title}
        actionLabel={he.drivers.addDriver}
        onAction={handleCreate}
      />

      <DriverTable
        data={drivers}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={setDeletingDriver}
      />

      <DriverForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createDriver.isPending || updateDriver.isPending}
        driver={editingDriver}
      />

      <ConfirmDialog
        title={he.common.delete}
        message={he.common.confirmDelete}
        isOpen={!!deletingDriver}
        onConfirm={handleDelete}
        onCancel={() => setDeletingDriver(null)}
        isDestructive
        isLoading={deleteDriver.isPending}
      />
    </div>
  );
}
