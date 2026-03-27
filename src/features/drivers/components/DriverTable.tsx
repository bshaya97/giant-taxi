import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';
import { useAuth } from '@/hooks/useAuth';
import type { Driver } from '../types';

type DriverTableProps = {
  data: Driver[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
};

const columns: Column<Driver>[] = [
  { key: 'full_name', header: he.drivers.fullName, sortable: true },
  { key: 'id_number', header: he.drivers.idNumber },
  {
    key: 'vehicle',
    header: he.drivers.vehicle,
    cell: (row) => {
      const vehicles = (row as any).vehicles;
      return vehicles?.license_plate || '—';
    },
  },
  {
    key: 'public_right',
    header: he.vehicles.publicRight,
    cell: (row) => {
      const vehicles = (row as any).vehicles;
      const publicRights = vehicles?.public_rights;
      return publicRights?.right_number || '—';
    },
  },
  { key: 'phone', header: he.drivers.phone },
  {
    key: 'engagement_type',
    header: he.drivers.engagementType,
    cell: (row) =>
      row.engagement_type === 'licensed_dealer'
        ? he.drivers.licensedDealer
        : he.drivers.payroll,
  },
  {
    key: 'status',
    header: he.common.status,
    cell: (row) => (
      <StatusBadge
        label={row.status === 'active' ? he.drivers.statusActive : he.drivers.statusInactive}
        variant={row.status === 'active' ? 'success' : 'neutral'}
      />
    ),
  },
];

export function DriverTable({ data, isLoading, error, onEdit, onDelete }: DriverTableProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <DataTable<Driver>
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={error}
      onRowClick={(driver) => navigate(`/drivers/${driver.id}`)}
      actions={(driver) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => onEdit(driver)}>
            {he.common.edit}
          </Button>
          {isAdmin && (
            <Button variant="danger" size="sm" onClick={() => onDelete(driver)}>
              {he.common.delete}
            </Button>
          )}
        </div>
      )}
    />
  );
}
