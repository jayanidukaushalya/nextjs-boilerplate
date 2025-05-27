'use client';

import type { UseRowSelectionReturn } from '@/hooks/use-row-selection';
import type { DataTableRowAction } from '@/types/data-table.types';
import type { Product } from '@/types/example-data.types';
import type { ColumnDef } from '@tanstack/react-table';

import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';

import DataTableColumnHeader from '@/components/common/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Routes } from '@/constants/routes.constants';

import ProductTableActions from './product-table-actions';

interface Props {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Product> | null>>;
  // Row selection hook return value
  rowSelection: UseRowSelectionReturn<Product>;
}

const getProductTableColumns = ({ setRowAction, rowSelection }: Props): ColumnDef<Product>[] => [
  {
    id: 'select',
    header: ({ table }) => {
      // Calculate if some rows are selected but not all (for indeterminate state)
      const rowCount = table.getFilteredRowModel().rows.length;
      const selectedCount = table
        .getFilteredRowModel()
        .rows.filter((row) => rowSelection.isRowSelected(row.original)).length;

      const isIndeterminate =
        selectedCount > 0 && selectedCount < rowCount && !rowSelection.selectAll;

      return (
        <Checkbox
          checked={rowSelection.selectAll || (rowCount > 0 && selectedCount === rowCount)}
          onCheckedChange={(value) => {
            rowSelection.toggleAllSelected(!!value);
          }}
          aria-label="Select all rows across all pages"
          className="translate-y-0.5"
          data-state={isIndeterminate ? 'indeterminate' : undefined}
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={rowSelection.isRowSelected(row.original)}
        onCheckedChange={(value) => {
          rowSelection.toggleRowSelected(row.original, !!value);
        }}
        aria-label={`Select row ${row.original.id}`}
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'image',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.image}
          alt={row.original.name}
          width={50}
          height={50}
          className="rounded-md"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <Link href={`${Routes.PLAYGROUND_PRODUCTS}/${row.original.id}`}>
        <span className="font-medium">{`#${row.original.id}`}</span>
      </Link>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="capitalize">{row.original.name}</span>,
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Brand" />,
    cell: ({ row }) => <span>{row.original.brand.name}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <span>{row.original.category.name}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader title="Created At" column={column} />,
    cell: ({ row }) => <span>{format(row.original.createdAt, 'dd MMM yyyy @ hh:mm a')}</span>,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader title="Updated At" column={column} />,
    cell: ({ row }) => <span>{format(row.original.updatedAt, 'dd MMM yyyy @ hh:mm a')}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProductTableActions row={row} setRowAction={setRowAction} />,
  },
];

export default getProductTableColumns;
