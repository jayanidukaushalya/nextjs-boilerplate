'use client';

import type { PaginationState } from '@tanstack/react-table';

import { useCallback, useMemo } from 'react';

import { useQueryStates } from 'nuqs';

import { searchParamsParsers } from '@/nuqs';

interface UsePaginationProps {
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
   * Clear URL query key-value pair when state is set to default.
   * Keep URL meaning consistent when defaults change.
   * @default false
   */
  clearOnDefault?: boolean;

  /**
   * Default page size
   * @default 10
   */
  defaultPageSize?: number;

  /**
   * Default page index (1-based)
   * @default 1
   */
  defaultPageIndex?: number;
}

const usePagination = ({
  history = 'replace',
  scroll = false,
  shallow = true,
  clearOnDefault = false,
  defaultPageSize = 10,
  defaultPageIndex = 1,
}: UsePaginationProps = {}) => {
  const [searchParams, setSearchParams] = useQueryStates(searchParamsParsers, {
    history,
    scroll,
    shallow,
    clearOnDefault,
  });

  // Convert to PaginationState (0-based index for tanstack table)
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: searchParams.page - 1,
      pageSize: searchParams.limit,
    }),
    [searchParams.page, searchParams.limit],
  );

  const setPagination = useCallback(
    (newPagination: PaginationState) => {
      void setSearchParams({
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      });
    },
    [setSearchParams],
  );

  const resetPagination = useCallback(() => {
    void setSearchParams({
      page: defaultPageIndex,
      limit: defaultPageSize,
    });
  }, [setSearchParams, defaultPageIndex, defaultPageSize]);

  return {
    pagination,
    setPagination,
    resetPagination,
    // Raw values
    searchParams,
    setSearchParams,
  };
};

export default usePagination;
