import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { he } from '@/i18n/he';
import {
  createUserSchema,
  editUserSchema,
  type CreateUserFormData,
  type EditUserFormData,
} from '../schemas/userSchema';
import type { User } from '../types';

type UserFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (data: CreateUserFormData) => void;
  onSubmitEdit: (data: EditUserFormData) => void;
  isSubmitting: boolean;
  user?: User | null;
};

const roleOptions = [
  { value: 'office', label: he.users.roleOffice },
  { value: 'admin', label: he.users.roleAdmin },
];

const statusOptions = [
  { value: 'true', label: he.users.statusActive },
  { value: 'false', label: he.users.statusInactive },
];

export function UserForm({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitEdit,
  isSubmitting,
  user,
}: UserFormProps) {
  const isEdit = !!user;

  const createForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', password: '', full_name: '' },
  });

  const editForm = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { full_name: '', role: 'office', is_active: 'true' },
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        editForm.reset({
          full_name: user.full_name,
          role: user.role,
          is_active: user.is_active ? 'true' : 'false',
        });
      } else {
        createForm.reset({
          email: '',
          password: '',
          full_name: '',
        });
      }
    }
  }, [isOpen, user, createForm, editForm]);

  if (isEdit) {
    return (
      <FormDialog
        title={he.common.edit}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={editForm.handleSubmit(onSubmitEdit)}
        isSubmitting={isSubmitting}
      >
        <FormField
          id="full_name"
          label={he.users.fullName}
          error={editForm.formState.errors.full_name?.message}
          {...editForm.register('full_name')}
        />
        <SelectField
          id="role"
          label={he.users.role}
          options={roleOptions}
          error={editForm.formState.errors.role?.message}
          {...editForm.register('role')}
        />
        <SelectField
          id="is_active"
          label={he.common.status}
          options={statusOptions}
          error={editForm.formState.errors.is_active?.message}
          {...editForm.register('is_active')}
        />
      </FormDialog>
    );
  }

  return (
    <FormDialog
      title={he.users.addUser}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={createForm.handleSubmit(onSubmitCreate)}
      isSubmitting={isSubmitting}
    >
      <FormField
        id="full_name"
        label={he.users.fullName}
        error={createForm.formState.errors.full_name?.message}
        {...createForm.register('full_name')}
      />
      <FormField
        id="email"
        label={he.users.email}
        type="email"
        dir="ltr"
        error={createForm.formState.errors.email?.message}
        {...createForm.register('email')}
      />
      <FormField
        id="password"
        label={he.users.password}
        type="password"
        dir="ltr"
        error={createForm.formState.errors.password?.message}
        {...createForm.register('password')}
      />
    </FormDialog>
  );
}
