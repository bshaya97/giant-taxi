import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';
import type { User } from '../types';

type UserTableProps = {
  data: User[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

const columns: Column<User>[] = [
  { key: 'full_name', header: he.users.fullName, sortable: true },
  { key: 'email', header: he.users.email },
  {
    key: 'role',
    header: he.users.role,
    cell: (row) => (row.role === 'admin' ? he.users.roleAdmin : he.users.roleOffice),
  },
  {
    key: 'is_active',
    header: he.common.status,
    cell: (row) => (
      <StatusBadge
        label={row.is_active ? he.users.statusActive : he.users.statusInactive}
        variant={row.is_active ? 'success' : 'neutral'}
      />
    ),
  },
];

export function UserTable({ data, isLoading, error, onEdit, onDelete }: UserTableProps) {
  return (
    <DataTable<User>
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={error}
      actions={(user) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => onEdit(user)}>
            {he.common.edit}
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(user)}>
            {he.common.delete}
          </Button>
        </div>
      )}
    />
  );
}
