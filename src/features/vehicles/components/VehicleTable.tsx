import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { he } from '@/i18n/he';
import { useAuth } from '@/hooks/useAuth';
import type { Vehicle } from '../types';

type VehicleTableProps = {
  data: Vehicle[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
};

export function VehicleTable({ data, isLoading, error, onEdit, onDelete }: VehicleTableProps) {
  const { isAdmin } = useAuth();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'rented':
        return 'warning';
      case 'maintenance':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return he.vehicles.statusAvailable;
      case 'rented':
        return he.vehicles.statusRented;
      case 'maintenance':
        return he.vehicles.statusMaintenance;
      case 'inactive':
        return he.vehicles.statusInactive;
      default:
        return status;
    }
  };

  return (
    <DataTable<Vehicle>
      columns={[
        { key: 'license_plate', header: he.vehicles.licensePlate },
        { key: 'make', header: he.vehicles.make },
        { key: 'model', header: he.vehicles.model },
        { key: 'year', header: he.vehicles.year, cell: (row) => row.year || '—' },
        { key: 'color', header: he.vehicles.color },
        {
          key: 'status',
          header: he.common.status,
          cell: (row) => (
            <StatusBadge label={getStatusLabel(row.status)} variant={getStatusVariant(row.status)} />
          ),
        },
      ]}
      data={data}
      isLoading={isLoading}
      error={error}
      actions={(row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(row)}>
            {he.common.edit}
          </Button>
          {isAdmin && (
            <Button size="sm" variant="danger" onClick={() => onDelete(row)}>
              {he.common.delete}
            </Button>
          )}
        </div>
      )}
      onRowClick={onEdit}
    />
  );
}
