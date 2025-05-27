'use client';

import type { DataTableRowAction } from '@/types/data-table.types';
import type { Product } from '@/types/example-data.types';
import type { Row } from '@tanstack/react-table';

import Link from 'next/link';

import { MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Routes } from '@/constants/routes.constants';

interface Props {
  row: Row<Product>;
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Product> | null>>;
}

const ProductTableActions = ({ row, setRowAction }: Props) => {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2">
            <MoreHorizontal className="cursor-pointer size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`${Routes.PLAYGROUND_PRODUCTS}/${row.original.id}`}>
            <DropdownMenuItem className="text-xs cursor-pointer text-slate-700">
              Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onSelect={() => setRowAction({ row, type: 'delete' })}
            className="text-xs cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/15"
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProductTableActions;
