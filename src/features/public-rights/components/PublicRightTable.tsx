import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';
import { useAuth } from '@/hooks/useAuth';
import type { PublicRight } from '../types';

type PublicRightTableProps = {
  data: PublicRight[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (publicRight: PublicRight) => void;
  onDelete: (publicRight: PublicRight) => void;
};

const statusVariants = {
  available: 'success' as const,
  assigned_to_company_vehicle: 'info' as const,
  rented_to_private: 'warning' as const,
  frozen: 'danger' as const,
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'available':
      return he.publicRights.statusAvailable;
    case 'assigned_to_company_vehicle':
      return he.publicRights.statusAssignedToVehicle;
    case 'rented_to_private':
      return he.publicRights.statusRentedToPrivate;
    case 'frozen':
      return he.publicRights.statusFrozen;
    default:
      return status;
  }
};

const columns: Column<PublicRight>[] = [
  { key: 'right_number', header: he.publicRights.rightNumber, sortable: true },
  {
    key: 'status',
    header: he.common.status,
    cell: (row) => (
      <StatusBadge
        label={getStatusLabel(row.status)}
        variant={statusVariants[row.status as keyof typeof statusVariants]}
      />
    ),
  },
];

export function PublicRightTable({
  data,
  isLoading,
  error,
  onEdit,
  onDelete,
}: PublicRightTableProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <DataTable<PublicRight>
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={error}
      onRowClick={(publicRight) => navigate(`/public-rights/${publicRight.id}`)}
      actions={(publicRight) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(publicRight)}>
            {he.common.edit}
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(publicRight)}>
              {he.common.delete}
            </Button>
          )}
        </div>
      )}
    />
  );
}
