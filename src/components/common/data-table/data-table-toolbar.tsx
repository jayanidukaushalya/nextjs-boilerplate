'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFilterField } from '@/types/data-table.types';
import { cn } from '@/utils/tailwind-utils';
import DataTableFacetedFilter from './data-table-faceted-filter';
import DataTableViewOptions from './data-table-view-options';

type DataTableToolbarProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>;
  /**
   * An array of filter field configurations for the data table.
   * When options are provided, a faceted filter is rendered.
   * Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields?: DataTableFilterField<TData>[];
};

const DataTableToolbar = <TData,>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div
      className={cn('flex gap-2 justify-between items-center py-1 w-full', className)}
      {...props}
    >
      <div className="flex flex-1 gap-2 items-center">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <Input
                  autoFocus
                  key={String(column.id)}
                  placeholder={column.placeholder}
                  value={(table.getColumn(String(column.id))?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn(String(column.id))?.setFilterValue(event.target.value)
                  }
                  className="w-40 h-8 lg:w-64"
                />
              ),
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : '')}
                  title={column.label}
                  options={column.options ?? []}
                />
              ),
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="secondary"
            className="px-2 h-8 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            <span className="text-xs">Reset</span>
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex gap-2 items-center">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
};

export default DataTableToolbar;
