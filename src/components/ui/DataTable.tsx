import { useState, type ReactNode } from 'react';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { he } from '@/i18n/he';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
    <>
      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-start font-medium text-sm whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none hover:text-gray-700' : ''
                  }`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortKey === col.key && (
                      <span className="inline-flex">
                        {sortAsc ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-start font-medium text-sm">{he.common.actions}</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.map((row, idx) => (
              <tr
                key={idx}
                className={`bg-white transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-start text-gray-800 whitespace-nowrap">
                    {col.cell ? col.cell(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
                {actions && (
                  <td
                    className="px-4 py-3 text-start whitespace-nowrap"
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

      {/* Mobile card list view */}
      <div className="md:hidden space-y-3">
        {sortedData.map((row, idx) => {
          const primaryCol = columns[0]!;
          const secondaryColumns = columns.slice(1);
          const primaryValue = primaryCol.cell ? primaryCol.cell(row) : String(row[primaryCol.key] ?? '');

          return (
            <div
              key={idx}
              className={`rounded-lg border border-gray-200 bg-white shadow-sm p-4 ${
                onRowClick ? 'cursor-pointer active:bg-gray-50' : ''
              }`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {/* Primary field as card title */}
              <div className="text-base font-semibold text-gray-900 mb-3">{primaryValue}</div>

              {/* Secondary fields as label:value pairs */}
              {secondaryColumns.length > 0 && (
                <dl className="space-y-1.5">
                  {secondaryColumns.map((col) => {
                    const value = col.cell ? col.cell(row) : String(row[col.key] ?? '');
                    return (
                      <div key={col.key} className="flex items-start gap-2 text-sm">
                        <dt className="shrink-0 text-gray-500">{col.header}:</dt>
                        <dd className="text-gray-900 break-words">{value}</dd>
                      </div>
                    );
                  })}
                </dl>
              )}

              {/* Actions */}
              {actions && (
                <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3" onClick={(e) => e.stopPropagation()}>
                  {actions(row)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
