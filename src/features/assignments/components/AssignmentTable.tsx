import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';
import { useAuth } from '@/hooks/useAuth';

type AssignmentTableProps<T> = {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  columns: Column<T>[];
  onClose: (assignment: T) => void;
  getStatusText: (isActive: boolean) => string;
};

export function AssignmentTable<T extends { is_active: boolean; id: string }>({
  data,
  isLoading,
  error,
  columns,
  onClose,
  getStatusText,
}: AssignmentTableProps<T>) {
  const { isAdmin } = useAuth();

  const allColumns: Column<T>[] = [
    ...columns,
    {
      key: 'is_active',
      header: he.common.status,
      cell: (row) => (
        <StatusBadge
          label={getStatusText(row.is_active)}
          variant={row.is_active ? 'success' : 'neutral'}
        />
      ),
    },
  ];

  return (
    <DataTable<T>
      columns={allColumns}
      data={data}
      isLoading={isLoading}
      error={error}
      actions={(assignment) => (
        <div className="flex gap-2">
          {assignment.is_active && isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => onClose(assignment)}>
              {he.assignments.closeAssignment}
            </Button>
          )}
        </div>
      )}
    />
  );
}
