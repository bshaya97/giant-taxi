import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { he } from '@/i18n/he';
import { useCharges, useCreateCharge, useUpdateCharge, useDeleteCharge } from '../hooks/useCharges';
import { ChargeTable } from '../components/ChargeTable';
import { ChargeForm } from '../components/ChargeForm';
import type { ChargeFormData } from '../schemas/chargeSchema';
import type { Charge } from '../types';

export function ChargesListPage() {
  const { data: charges = [], isLoading, error } = useCharges();
  const createCharge = useCreateCharge();
  const updateCharge = useUpdateCharge();
  const deleteCharge = useDeleteCharge();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [deletingCharge, setDeletingCharge] = useState<Charge | null>(null);

  const handleCreate = () => {
    setEditingCharge(null);
    setIsFormOpen(true);
  };

  const handleEdit = (charge: Charge) => {
    setEditingCharge(charge);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: ChargeFormData) => {
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
      description: data.description || null,
      period_start: data.period_start || null,
      period_end: data.period_end || null,
      driver_id: data.driver_id || null,
      vehicle_id: data.vehicle_id || null,
      renter_id: data.renter_id || null,
      public_right_id: data.public_right_id || null,
      notes: data.notes || null,
    };

    if (editingCharge) {
      updateCharge.mutate(
        { id: editingCharge.id, data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast.success('החיוב עודכן בהצלחה');
          },
          onError: () => toast.error('שגיאה בעדכון החיוב'),
        },
      );
    } else {
      createCharge.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('החיוב נוצר בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת החיוב'),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingCharge) return;
    deleteCharge.mutate(deletingCharge.id, {
      onSuccess: () => {
        setDeletingCharge(null);
        toast.success('החיוב נמחק בהצלחה');
      },
      onError: () => toast.error('שגיאה במחיקת החיוב'),
    });
  };

  return (
    <div>
      <PageHeader
        title={he.charges.title}
        actionLabel={he.charges.addCharge}
        onAction={handleCreate}
      />

      <ChargeTable
        data={charges}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={setDeletingCharge}
      />

      <ChargeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createCharge.isPending || updateCharge.isPending}
        charge={editingCharge}
      />

      <ConfirmDialog
        title={he.common.delete}
        message={he.common.confirmDelete}
        isOpen={!!deletingCharge}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCharge(null)}
        isDestructive
        isLoading={deleteCharge.isPending}
      />
    </div>
  );
}
