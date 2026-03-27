import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';
import { useAuth } from '@/hooks/useAuth';
import type { Renter } from '../types';

type RenterTableProps = {
  data: Renter[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (renter: Renter) => void;
  onDelete: (renter: Renter) => void;
};

const columns: Column<Renter>[] = [
  { key: 'full_name', header: he.renters.fullName, sortable: true },
  { key: 'id_number', header: he.renters.idNumber },
  { key: 'phone', header: he.renters.phone },
  { key: 'company_name', header: he.renters.companyName },
  {
    key: 'status',
    header: he.common.status,
    cell: (row) => (
      <StatusBadge
        label={row.status === 'active' ? he.renters.statusActive : he.renters.statusInactive}
        variant={row.status === 'active' ? 'success' : 'neutral'}
      />
    ),
  },
];

export function RenterTable({ data, isLoading, error, onEdit, onDelete }: RenterTableProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <DataTable<Renter>
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={error}
      onRowClick={(renter) => navigate(`/renters/${renter.id}`)}
      actions={(renter) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => onEdit(renter)}>
            {he.common.edit}
          </Button>
          {isAdmin && (
            <Button variant="danger" size="sm" onClick={() => onDelete(renter)}>
              {he.common.delete}
            </Button>
          )}
        </div>
      )}
    />
  );
}
