'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Routes } from '@/constants/routes.constants';
import { DataTableRowAction } from '@/types/data-table.types';
import { IProduct } from '@/types/mock-data.types';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

type Props = {
  row: Row<IProduct>;
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<IProduct> | null>>;
};

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
            className="text-xs cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/15"
            onSelect={() => setRowAction({ row, type: 'delete' })}
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProductTableActions;
