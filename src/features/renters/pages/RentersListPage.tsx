import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { he } from '@/i18n/he';
import {
  useRenters,
  useCreateRenter,
  useUpdateRenter,
  useDeleteRenter,
} from '../hooks/useRenters';
import { RenterTable } from '../components/RenterTable';
import { RenterForm } from '../components/RenterForm';
import type { RenterFormData } from '../schemas/renterSchema';
import type { Renter } from '../types';

export function RentersListPage() {
  const { data: renters = [], isLoading, error } = useRenters();
  const createRenter = useCreateRenter();
  const updateRenter = useUpdateRenter();
  const deleteRenter = useDeleteRenter();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRenter, setEditingRenter] = useState<Renter | null>(null);
  const [deletingRenter, setDeletingRenter] = useState<Renter | null>(null);

  const handleCreate = () => {
    setEditingRenter(null);
    setIsFormOpen(true);
  };

  const handleEdit = (renter: Renter) => {
    setEditingRenter(renter);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: RenterFormData) => {
    const payload = {
      ...data,
      phone: data.phone || null,
      email: data.email || null,
      company_name: data.company_name || null,
      notes: data.notes || null,
    };

    if (editingRenter) {
      updateRenter.mutate(
        { id: editingRenter.id, data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast.success('השוכר עודכן בהצלחה');
          },
          onError: () => toast.error('שגיאה בעדכון השוכר'),
        },
      );
    } else {
      createRenter.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('השוכר נוצר בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת השוכר'),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingRenter) return;
    deleteRenter.mutate(deletingRenter.id, {
      onSuccess: () => {
        setDeletingRenter(null);
        toast.success('השוכר נמחק בהצלחה');
      },
      onError: () => toast.error('שגיאה במחיקת השוכר'),
    });
  };

  return (
    <div>
      <PageHeader
        title={he.renters.title}
        actionLabel={he.renters.addRenter}
        onAction={handleCreate}
      />

      <RenterTable
        data={renters}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={setDeletingRenter}
      />

      <RenterForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createRenter.isPending || updateRenter.isPending}
        renter={editingRenter}
      />

      <ConfirmDialog
        title={he.common.delete}
        message={he.common.confirmDelete}
        isOpen={!!deletingRenter}
        onConfirm={handleDelete}
        onCancel={() => setDeletingRenter(null)}
        isDestructive
        isLoading={deleteRenter.isPending}
      />
    </div>
  );
}
