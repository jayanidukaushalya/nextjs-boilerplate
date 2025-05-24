import { ColumnSort, Row } from '@tanstack/react-table';

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: 'update' | 'delete';
}

export interface DataTableFilterField<TData> {
  id: string;
  label: string;
  placeholder?: string;
  options?: Option[];
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: StringKeyOf<TData>;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];
