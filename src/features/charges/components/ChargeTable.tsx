import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';
import { useAuth } from '@/hooks/useAuth';
import type { Charge } from '../types';

type ChargeTableProps = {
  data: Charge[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (charge: Charge) => void;
  onDelete: (charge: Charge) => void;
};

const statusVariants = {
  draft: 'neutral' as const,
  open: 'info' as const,
  paid: 'success' as const,
  cancelled: 'danger' as const,
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'draft':
      return he.charges.statusDraft;
    case 'open':
      return he.charges.statusOpen;
    case 'paid':
      return he.charges.statusPaid;
    case 'cancelled':
      return he.charges.statusCancelled;
    default:
      return status;
  }
};

const getChargeTypeLabel = (type: string): string => {
  switch (type) {
    case 'vehicle_rental':
      return he.charges.vehicleRental;
    case 'public_right_rental':
      return he.charges.publicRightRental;
    default:
      return type;
  }
};

const columns: Column<Charge>[] = [
  {
    key: 'charge_type',
    header: he.charges.chargeType,
    cell: (row) => getChargeTypeLabel(row.charge_type),
  },
  { key: 'amount', header: he.charges.amount },
  {
    key: 'charge_status',
    header: he.common.status,
    cell: (row) => (
      <StatusBadge
        label={getStatusLabel(row.charge_status)}
        variant={statusVariants[row.charge_status as keyof typeof statusVariants]}
      />
    ),
  },
];

export function ChargeTable({ data, isLoading, error, onEdit, onDelete }: ChargeTableProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <DataTable<Charge>
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={error}
      onRowClick={(charge) => navigate(`/charges/${charge.id}`)}
      actions={(charge) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => onEdit(charge)}>
            {he.common.edit}
          </Button>
          {isAdmin && (
            <Button variant="danger" size="sm" onClick={() => onDelete(charge)}>
              {he.common.delete}
            </Button>
          )}
        </div>
      )}
    />
  );
}
