import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { he } from '@/i18n/he';
import {
  usePublicRights,
  useCreatePublicRight,
  useUpdatePublicRight,
  useDeletePublicRight,
} from '../hooks/usePublicRights';
import { PublicRightTable } from '../components/PublicRightTable';
import { PublicRightForm } from '../components/PublicRightForm';
import type { PublicRightFormData } from '../schemas/publicRightSchema';
import type { PublicRight } from '../types';

export function PublicRightsListPage() {
  const { data: publicRights = [], isLoading, error } = usePublicRights();
  const createPublicRight = useCreatePublicRight();
  const updatePublicRight = useUpdatePublicRight();
  const deletePublicRight = useDeletePublicRight();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPublicRight, setEditingPublicRight] = useState<PublicRight | null>(null);
  const [deletingPublicRight, setDeletingPublicRight] = useState<PublicRight | null>(null);

  const handleCreate = () => {
    setEditingPublicRight(null);
    setIsFormOpen(true);
  };

  const handleEdit = (publicRight: PublicRight) => {
    setEditingPublicRight(publicRight);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: PublicRightFormData) => {
    const payload = {
      ...data,
      notes: data.notes || null,
    };

    if (editingPublicRight) {
      updatePublicRight.mutate(
        { id: editingPublicRight.id, data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast.success('הזכות עודכנה בהצלחה');
          },
          onError: () => toast.error('שגיאה בעדכון הזכות'),
        },
      );
    } else {
      createPublicRight.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('הזכות נוצרה בהצלחה');
        },
        onError: () => toast.error('שגיאה ביצירת הזכות'),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingPublicRight) return;
    deletePublicRight.mutate(deletingPublicRight.id, {
      onSuccess: () => {
        setDeletingPublicRight(null);
        toast.success('הזכות נמחקה בהצלחה');
      },
      onError: () => toast.error('שגיאה במחיקת הזכות'),
    });
  };

  return (
    <div>
      <PageHeader
        title={he.publicRights.title}
        actionLabel={he.publicRights.addRight}
        onAction={handleCreate}
      />

      <PublicRightTable
        data={publicRights}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={setDeletingPublicRight}
      />

      <PublicRightForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createPublicRight.isPending || updatePublicRight.isPending}
        publicRight={editingPublicRight}
      />

      <ConfirmDialog
        title={he.common.delete}
        message={he.common.confirmDelete}
        isOpen={!!deletingPublicRight}
        onConfirm={handleDelete}
        onCancel={() => setDeletingPublicRight(null)}
        isDestructive
        isLoading={deletePublicRight.isPending}
      />
    </div>
  );
}
