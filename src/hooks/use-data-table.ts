'use client';

import type { ExtendedSortingState } from '@/types/data-table.types';
import type {
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import type { UseQueryStateOptions } from 'nuqs';

import { useMemo, useState } from 'react';

import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useQueryStates } from 'nuqs';

import { EntityOrder } from '@/constants/common.constants';
import { searchParamsParsers } from '@/nuqs';

type UseDataTableProps<TData> = Omit<
  TableOptions<TData>,
  'state' | 'getCoreRowModel' | 'manualSorting'
> & {
  /**
   * Determines how query updates affect history.
   * `push` creates a new history entry; `replace` (default) updates the current entry.
   * @default "replace"
   */
  history?: 'push' | 'replace';

  /**
   * Indicates whether the page should scroll to the top when the URL changes.
   * @default false
   */
  scroll?: boolean;

  /**
   * Shallow mode keeps query states client-side, avoiding server calls.
   * Setting to `false` triggers a network request with the updated querystring.
   * @default true
   */
  shallow?: boolean;

  /**
   * Maximum time (ms) to wait between URL query string updates.
   * Helps with browser rate-limiting. Minimum effective value is 50ms.
   * @default 50
   */
  throttleMs?: number;

  /**
   * Observe Server Component loading states for non-shallow updates.
   * Pass `startTransition` from `React.useTransition()`.
   * Sets `shallow` to `false` automatically.
   * So shallow: true` and `startTransition` cannot be used at the same time.
   * @see https://react.dev/reference/react/useTransition
   */
  startTransition?: React.TransitionStartFunction;

  /**
   * Clear URL query key-value pair when state is set to default.
   * Keep URL meaning consistent when defaults change.
   * @default false
   */
  clearOnDefault?: boolean;

  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    // Extend to make the sorting id typesafe
    sorting?: ExtendedSortingState<TData>;
  };
};

const useDataTable = <TData>({
  history = 'replace',
  scroll = false,
  shallow = true,
  throttleMs = 50,
  clearOnDefault = false,
  startTransition,
  initialState,
  ...props
}: UseDataTableProps<TData>) => {
  const queryStateOptions = useMemo<Omit<UseQueryStateOptions<string>, 'parse'>>(() => {
    return {
      history,
      scroll,
      shallow,
      throttleMs,
      clearOnDefault,
      startTransition,
    };
  }, [history, scroll, shallow, throttleMs, clearOnDefault, startTransition]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  );

  const [searchParams, setSearchparams] = useQueryStates(searchParamsParsers, queryStateOptions);

  // Sort
  const onSortingChange = (updaterOrValue: Updater<SortingState>) => {
    if (typeof updaterOrValue === 'function') {
      const newSorting = updaterOrValue([
        { id: searchParams.sortby, desc: searchParams.order === EntityOrder.DESC },
      ]) as ExtendedSortingState<TData>;

      void setSearchparams({
        sortby: newSorting[0].id,
        order: newSorting[0].desc ? EntityOrder.DESC : EntityOrder.ASC,
        page: 1,
      });
    }
  };

  const table = useReactTable({
    ...props,
    initialState,
    state: {
      sorting: [{ id: searchParams.sortby, desc: searchParams.order === EntityOrder.DESC }],
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  return { table };
};

export default useDataTable;
