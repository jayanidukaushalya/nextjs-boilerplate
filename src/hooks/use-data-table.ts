'use client';

import { EntityOrder } from '@/constants';
import { searchParamsParsers } from '@/nuqs';
import { DataTableFilterField, ExtendedSortingState } from '@/types/data-table.types';
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  parseAsArrayOf,
  parseAsString,
  useQueryStates,
  type Parser,
  type UseQueryStateOptions,
} from 'nuqs';
import { useCallback, useMemo, useState } from 'react';
import { useDebouncedCallback } from './use-debounced-callback';

type UseDataTableProps<TData> = Omit<
  TableOptions<TData>,
  | 'state'
  | 'pageCount'
  | 'getCoreRowModel'
  | 'manualFiltering'
  | 'manualPagination'
  | 'manualSorting'
> &
  Required<Pick<TableOptions<TData>, 'pageCount'>> & {
    /**
     * Defines filter fields for the table. Supports both dynamic faceted filters and search filters.
     * - Faceted filters are rendered when `options` are provided for a filter field.
     * - Otherwise, search filters are rendered.
     *
     * The indie filter field `value` represents the corresponding column name in the database table.
     * @default []
     * @type { label: string, value: keyof TData, placeholder?: string, options?: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[] }[]
     * @example
     * ```ts
     * // Render a search filter
     * const filterFields = [
     *   { label: "Title", value: "title", placeholder: "Search titles" }
     * ];
     * // Render a faceted filter
     * const filterFields = [
     *   {
     *     label: "Status",
     *     value: "status",
     *     options: [
     *       { label: "Todo", value: "todo" },
     *       { label: "In Progress", value: "in-progress" },
     *     ]
     *   }
     * ];
     * ```
     */
    filterFields?: DataTableFilterField<TData>[];

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
     * Debounce time (ms) for filter updates to enhance performance during rapid input.
     * @default 300
     */
    debounceMs?: number;

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
  pageCount = -1,
  filterFields = [],
  history = 'replace',
  scroll = false,
  shallow = true,
  throttleMs = 50,
  debounceMs = 300,
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

  // Create parsers for each filter field
  const filterParsers = useMemo(() => {
    return filterFields.reduce<Record<string, Parser<string> | Parser<string[]>>>((acc, field) => {
      if (field.options) {
        // Faceted filter
        acc[field.id] = parseAsArrayOf(parseAsString, ',').withOptions(queryStateOptions);
      } else {
        // Search filter
        acc[field.id] = parseAsString.withOptions(queryStateOptions);
      }
      return acc;
    }, {});
  }, [filterFields, queryStateOptions]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers, queryStateOptions);

  const debouncedSetFilterValues = useDebouncedCallback(setFilterValues, debounceMs);

  // Paginate
  const pagination: PaginationState = {
    pageIndex: searchParams.page - 1,
    pageSize: searchParams.limit,
  };

  const onPaginationChange = (updaterOrValue: Updater<PaginationState>) => {
    if (typeof updaterOrValue === 'function') {
      const newPagination = updaterOrValue(pagination);
      setSearchparams({
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      });
    } else {
      setSearchparams({
        page: updaterOrValue.pageIndex + 1,
        limit: updaterOrValue.pageSize,
      });
    }
  };

  // Sort
  const onSortingChange = (updaterOrValue: Updater<SortingState>) => {
    if (typeof updaterOrValue === 'function') {
      const newSorting = updaterOrValue([
        { id: searchParams.sortby, desc: searchParams.order === EntityOrder.DESC },
      ]) as ExtendedSortingState<TData>;
      setSearchparams({
        sortby: newSorting[0].id,
        order: newSorting[0].desc ? EntityOrder.DESC : EntityOrder.ASC,
        page: 1,
      });
    }
  };

  // Filter
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
      if (value !== null) {
        filters.push({
          id: key,
          value: Array.isArray(value) ? value : [value],
        });
      }
      return filters;
    }, []);
  }, [filterValues]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  const onColumnFiltersChange = useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;

        const filterUpdates = next.reduce<Record<string, string | string[] | null>>(
          (acc, filter) => {
            if (searchableColumns.find((col) => col.id === filter.id)) {
              // For search filters, use the value directly
              acc[filter.id] = filter.value as string;
            } else if (filterableColumns.find((col) => col.id === filter.id)) {
              // For faceted filters, use the array of values
              acc[filter.id] = filter.value as string[];
            }
            return acc;
          },
          {},
        );

        prev.forEach((prevFilter) => {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        });

        debouncedSetFilterValues(filterUpdates);
        setSearchparams({
          page: 1,
        });
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, searchableColumns, setSearchparams],
  );

  const table = useReactTable({
    ...props,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting: [{ id: searchParams.sortby, desc: searchParams.order === EntityOrder.DESC }],
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table };
};

export default useDataTable;
