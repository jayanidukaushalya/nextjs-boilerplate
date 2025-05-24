import { useCallback, useState } from 'react';

type SelectedRowsState<T> = {
  selectedRowsList: T[];
  selectedCount: number;
  totalCount: number;
};

export const useDataTableRowSelector = <T>() => {
  const [selectedRows, setSelectedRows] = useState<SelectedRowsState<T>>({
    selectedRowsList: [],
    selectedCount: 0,
    totalCount: 0,
  });

  const resetSelection = useCallback((totalCount: number) => {
    setSelectedRows({
      selectedRowsList: [],
      selectedCount: 0,
      totalCount,
    });
  }, []);

  const onSelectionChange = useCallback(
    ({ selectedRows, rows }: { selectedRows: T[]; rows: T[] }) => {
      setSelectedRows({
        selectedRowsList: selectedRows,
        selectedCount: selectedRows.length,
        totalCount: rows.length,
      });
    },
    [],
  );

  return { selectedRows, resetSelection, onSelectionChange };
};
