'use client';

import type { DataTableRowAction } from '@/types/data-table.types';
import type { Product } from '@/types/example-data.types';

import { useMemo, useState } from 'react';

import { useQueryStates } from 'nuqs';
import { toast } from 'sonner';

import DataTable from '@/components/common/data-table';
import DataTablePagination from '@/components/common/data-table/data-table-pagination';
import DataTableSkeleton from '@/components/common/data-table/data-table-skelton';
import { useProducts } from '@/hooks/examples/use-products';
import useDataTable from '@/hooks/use-data-table';
import useRowSelection from '@/hooks/use-row-selection';
import { productSearchParamsParsers } from '@/nuqs/product.nuqs';

import DeleteProductsModal from './delete-products-modal';
import getProductTableColumns from './product-table-columns';
import ProductTableToolbar from './product-table-toolbar';

const ProductTable = () => {
  const [rowAction, setRowAction] = useState<DataTableRowAction<Product> | null>(null);

  const [searchParams] = useQueryStates(productSearchParamsParsers);
  const { data: productsData, error, isLoading } = useProducts(searchParams);

  const totalPages = useMemo(
    () => (productsData ? Math.ceil(productsData?.extras?.total / searchParams.limit) : 1),
    [productsData, searchParams.limit],
  );

  const tableData = useMemo(() => productsData?.results ?? [], [productsData?.results]);
  const totalDataCount = useMemo(
    () => productsData?.extras?.total ?? 0,
    [productsData?.extras?.total],
  );

  // Use our custom row selection hook
  const rowSelection = useRowSelection<Product>({
    getRowId: (row) => row.id,
    totalCount: totalDataCount,
  });

  const columns = useMemo(
    () =>
      getProductTableColumns({
        setRowAction,
        rowSelection,
      }),
    [setRowAction, rowSelection],
  );

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageCount: totalPages,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (isLoading) {
    return (
      <DataTableSkeleton
        searchableColumnCount={1}
        filterableColumnCount={1}
        columnCount={table.getAllColumns().length}
        rowCount={searchParams.limit}
        cellWidths={['3rem', '7rem', '20rem', '10rem', '12rem', '12rem', '8rem', '8rem']}
        shrinkZero
      />
    );
  }

  if (error) {
    toast.error('An error occurred while fetching customers.');
  }

  return (
    <div className="space-y-4">
      <ProductTableToolbar table={table} rowSelection={rowSelection} />
      <DataTable table={table} />
      <DataTablePagination
        totalDataCount={totalDataCount}
        selectedCount={rowSelection.selectedCount}
      />

      <DeleteProductsModal
        products={rowAction?.row.original ? [rowAction?.row.original] : []}
        onSuccess={rowSelection.clearSelections}
        open={rowAction?.type === 'delete'}
        onOpenChange={() => {
          setRowAction(null);
        }}
      />
    </div>
  );
};

export default ProductTable;
