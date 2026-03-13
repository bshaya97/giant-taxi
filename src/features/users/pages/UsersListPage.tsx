import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { he } from '@/i18n/he';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';
import type { CreateUserFormData, EditUserFormData } from '../schemas/userSchema';
import type { User } from '../types';

export function UsersListPage() {
  const { data: users = [], isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCreateSubmit = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
        toast.success('המשתמש נוצר בהצלחה');
      },
      onError: (err) => toast.error(err.message || 'שגיאה ביצירת המשתמש'),
    });
  };

  const handleEditSubmit = (data: EditUserFormData) => {
    if (!editingUser) return;
    updateUser.mutate(
      {
        id: editingUser.id,
        data: {
          full_name: data.full_name,
          role: data.role,
          is_active: data.is_active === 'true',
        },
      },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('המשתמש עודכן בהצלחה');
        },
        onError: () => toast.error('שגיאה בעדכון המשתמש'),
      },
    );
  };

  const handleDelete = () => {
    if (!deletingUser) return;
    deleteUser.mutate(deletingUser.id, {
      onSuccess: () => {
        setDeletingUser(null);
        toast.success('המשתמש נמחק בהצלחה');
      },
      onError: () => toast.error('שגיאה במחיקת המשתמש'),
    });
  };

  return (
    <div>
      <PageHeader
        title={he.users.title}
        actionLabel={he.users.addUser}
        onAction={handleCreate}
      />

      <UserTable
        data={users}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={setDeletingUser}
      />

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitCreate={handleCreateSubmit}
        onSubmitEdit={handleEditSubmit}
        isSubmitting={createUser.isPending || updateUser.isPending}
        user={editingUser}
      />

      <ConfirmDialog
        title={he.common.delete}
        message={he.common.confirmDelete}
        isOpen={!!deletingUser}
        onConfirm={handleDelete}
        onCancel={() => setDeletingUser(null)}
        isDestructive
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
