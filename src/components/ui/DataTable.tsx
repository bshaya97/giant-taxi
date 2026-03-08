import { useState, type ReactNode } from 'react';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { he } from '@/i18n/he';

export type Column<T> = {
  key: string;
  header: string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  error?: Error | null;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  error,
  onRowClick,
  actions,
  emptyMessage = he.common.noResults,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (data.length === 0) return <EmptyState message={emptyMessage} />;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = String(aVal).localeCompare(String(bVal), 'he');
        return sortAsc ? cmp : -cmp;
      })
    : data;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-start font-medium ${
                  col.sortable ? 'cursor-pointer select-none hover:text-gray-900' : ''
                }`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                {col.header}
                {sortKey === col.key && (
                  <span className="me-1">{sortAsc ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-start font-medium">{he.common.actions}</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              className={`bg-white ${
                onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-start text-gray-800">
                  {col.cell ? col.cell(row) : String(row[col.key] ?? '')}
                </td>
              ))}
              {actions && (
                <td
                  className="px-4 py-3 text-start"
                  onClick={(e) => e.stopPropagation()}
                >
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
