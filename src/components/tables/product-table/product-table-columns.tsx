import DataTableColumnHeader from '@/components/common/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Routes } from '@/constants/routes.constants';
import { DataTableRowAction } from '@/types/data-table.types';
import { IProduct } from '@/types/mock-data.types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { formatValue } from 'react-currency-input-field';
import ProductTableActions from './product-table-actions';

type Props = {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IProduct> | null>>;
};

const getProductTableColumns = ({ setRowAction }: Props): ColumnDef<IProduct>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
    enableHiding: false,
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
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <span>{row.original.category.name}</span>,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => (
      <span>
        {formatValue({
          value: row.original.price,
          decimalScale: 2,
          prefix: '$',
        })}
      </span>
    ),
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
