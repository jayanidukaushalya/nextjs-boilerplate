'use client';

import { useCallback, useMemo, useState } from 'react';

interface UseRowSelectionProps<T> {
  /**
   * Function to get the unique ID from a row
   */
  getRowId: (row: T) => string;

  /**
   * Total number of items across all pages (for "select all" functionality)
   */
  totalCount: number;
}

export interface UseRowSelectionReturn<T> {
  /**
   * Record of selected row IDs to row objects
   */
  selectedRows: Record<string, T>;

  /**
   * Whether all rows across all pages are selected
   */
  selectAll: boolean;

  /**
   * Record of explicitly deselected row IDs when in selectAll mode
   */
  deselectedRows: Record<string, boolean>;

  /**
   * Number of selected rows
   */
  selectedCount: number;

  /**
   * Toggle selection for a specific row
   */
  toggleRowSelected: (row: T, selected: boolean) => void;

  /**
   * Toggle selection for all rows
   */
  toggleAllSelected: (selected: boolean) => void;

  /**
   * Check if a specific row is selected
   */
  isRowSelected: (row: T) => boolean;

  /**
   * Clear all selections
   */
  clearSelections: () => void;

  /**
   * Get selected row IDs
   */
  selectedRowIds: string[];

  /**
   * Get selected rows as an array
   */
  getSelectedRows: () => T[];

  /**
   * Get the selection state object containing all necessary information
   * for operations like deletion that need to know about selectAll and deselected rows
   */
  getSelectionState: () => {
    selectAll: boolean;
    selectedRows: Record<string, T>;
    deselectedRows: Record<string, boolean>;
    selectedCount: number;
  };
}

/**
 * Custom hook for managing row selection state across paginated tables
 */
const useRowSelection = <T>({
  getRowId,
  totalCount,
}: UseRowSelectionProps<T>): UseRowSelectionReturn<T> => {
  // Custom state to track selected rows across all pages
  const [selectedRows, setSelectedRows] = useState<Record<string, T>>({});

  // Track if all rows across all pages are selected
  const [selectAll, setSelectAll] = useState(false);

  // Track explicitly deselected rows when in selectAll mode
  const [deselectedRows, setDeselectedRows] = useState<Record<string, boolean>>({});

  // Get all selected row IDs
  /* eslint-disable */
  const selectedRowIds = useMemo(() => {
    if (selectAll) {
      // When in selectAll mode, we don't have all IDs, so just return the ones we explicitly know about
      return Object.keys(selectedRows);
    } else {
      return Object.keys(selectedRows);
    }
  }, [selectAll, selectedRows]);
  /* eslint-enable */

  // Calculate the total number of selected items
  const selectedCount = useMemo(() => {
    if (selectAll) {
      // When selectAll is true, total count minus explicitly deselected rows
      const deselectedCount = Object.keys(deselectedRows).length;
      return totalCount - deselectedCount;
    } else {
      // Otherwise just count the selected rows
      return selectedRowIds.length;
    }
  }, [selectAll, totalCount, deselectedRows, selectedRowIds.length]);

  // Get all selected rows as an array
  const getSelectedRows = useCallback(() => {
    return Object.values(selectedRows);
  }, [selectedRows]);

  // Toggle selection for a specific row
  const toggleRowSelected = (row: T, selected: boolean) => {
    const rowId = getRowId(row);

    if (selectAll) {
      // In selectAll mode, we manage exceptions to the rule
      if (selected) {
        // Remove from deselected list if it was previously deselected
        setDeselectedRows((prev) => {
          const newDeselected = { ...prev };
          delete newDeselected[rowId];
          return newDeselected;
        });
      } else {
        // Add to deselected list
        setDeselectedRows((prev) => ({
          ...prev,
          [rowId]: true,
        }));
      }
    } else {
      // Normal mode - directly manage selected rows
      if (selected) {
        // Add the row to selections
        setSelectedRows((prev) => ({
          ...prev,
          [rowId]: row,
        }));
      } else {
        // Remove the row from selections
        setSelectedRows((prev) => {
          const newSelectedRows = { ...prev };
          delete newSelectedRows[rowId];
          return newSelectedRows;
        });
      }
    }
  };

  // Toggle selection for all rows
  const toggleAllSelected = (selected: boolean) => {
    if (selected) {
      // Select all rows across all pages
      setSelectAll(true);
      // Clear the deselected rows list
      setDeselectedRows({});
    } else {
      // Deselect all rows
      setSelectAll(false);
      setSelectedRows({});
      setDeselectedRows({});
    }
  };

  // Check if a specific row is selected
  const isRowSelected = (row: T) => {
    const rowId = getRowId(row);
    if (selectAll) {
      // In selectAll mode, row is selected unless explicitly deselected
      return !deselectedRows[rowId];
    } else {
      // In normal mode, row is selected if in the selectedRows map
      return !!selectedRows[rowId];
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedRows({});
    setSelectAll(false);
    setDeselectedRows({});
  };

  // Get the selection state object with all necessary information
  const getSelectionState = useCallback(() => {
    return {
      selectAll,
      selectedRows,
      deselectedRows,
      selectedCount,
    };
  }, [selectAll, selectedRows, deselectedRows, selectedCount]);

  return {
    selectedRows,
    selectAll,
    deselectedRows,
    selectedCount,
    toggleRowSelected,
    toggleAllSelected,
    isRowSelected,
    clearSelections,
    selectedRowIds,
    getSelectedRows,
    getSelectionState,
  };
};

export default useRowSelection;
