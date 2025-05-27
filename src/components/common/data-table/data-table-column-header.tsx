'use client';

import { useMemo } from 'react';

import { type Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/tailwind-utils';

type DataTableColumnHeaderProps<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
  column: Column<TData, TValue>;
  title: string;
  align?: 'start' | 'center' | 'end';
};

const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
  align = 'start',
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const alignment = useMemo(() => {
    switch (align) {
      case 'start':
        return 'flex justify-start text-left';
      case 'center':
        return 'flex justify-center text-center';
      case 'end':
        return 'flex justify-end text-right';
    }
  }, [align]);

  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <div
        className={cn(
          `text-xs hover:text-accent-foreground transition text-nowrap`,
          alignment,
          className,
        )}
      >
        {title}
      </div>
    );
  }

  // These values are no longer needed with the dropdown implementation

  return (
    <div className={cn('flex items-center', alignment, className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={
              column.getIsSorted() === 'desc'
                ? 'Sorted descending. Click to sort ascending.'
                : column.getIsSorted() === 'asc'
                  ? 'Sorted ascending. Click to sort descending.'
                  : 'Not sorted. Click to sort ascending.'
            }
            className={cn(
              'flex items-center text-xs text-nowrap bg-transparent border-none p-0 cursor-pointer',
              alignment,
            )}
          >
            {title}
            {column.getCanSort() && column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 size-3" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 size-3" aria-hidden="true" />
            ) : (
              <ChevronsUpDown className="ml-1 size-3" aria-hidden="true" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align === 'end' ? 'end' : align === 'center' ? 'center' : 'start'}
        >
          {column.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <span className="flex items-center">
                  <ArrowUp className="mr-1 size-3 text-muted-foreground/70" aria-hidden="true" />
                  Asc
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <span className="flex items-center">
                  <ArrowDown className="mr-1 size-3 text-muted-foreground/70" aria-hidden="true" />
                  Desc
                </span>
              </DropdownMenuItem>
            </>
          )}
          {column.getCanHide() && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <span className="flex items-center">
                <EyeOff className="mr-1 size-3 text-muted-foreground/70" aria-hidden="true" />
                Hide
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DataTableColumnHeader;
