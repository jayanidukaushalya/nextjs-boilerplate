'use client';

import DataTable from '@/components/common/data-table';
import DataTableSkeleton from '@/components/common/data-table/data-table-skelton';
import DataTableToolbar from '@/components/common/data-table/data-table-toolbar';
import DeleteProductsModal from '@/components/modals/delete-products-modal';
import { useCategories } from '@/hooks/use-categories';
import useDataTable from '@/hooks/use-data-table';
import { useProducts } from '@/hooks/use-products';
import { productSearchParamsParsers } from '@/nuqs/product.nuqs';
import { DataTableFilterField, DataTableRowAction } from '@/types/data-table.types';
import { IProduct } from '@/types/mock-data.types';
import { useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import getProductTableColumns from './product-table-columns';
import ProductTableToolbar from './product-table-toolbar';

const ProductTable = () => {
  const [rowAction, setRowAction] = useState<DataTableRowAction<IProduct> | null>(null);

  const columns = useMemo(() => getProductTableColumns({ setRowAction }), [setRowAction]);

  const [searchParams] = useQueryStates(productSearchParamsParsers);

  // Use searchParams as a dependency to ensure the query is re-fetched when filters change
  const { data, error, isLoading } = useProducts(searchParams);

  const { data: categoriesData } = useCategories();

  const totalPages = useMemo(
    () => (data ? Math.ceil(data?.extras?.total / searchParams.limit) : 1),
    [data, searchParams.limit],
  );

  const tableData = useMemo(() => data?.results ?? [], [data?.results]);

  const filterFields: DataTableFilterField<IProduct>[] = [
    {
      id: 'name',
      label: 'Name',
      placeholder: 'Search here...',
    },
    {
      id: 'category',
      label: 'Category',
      placeholder: 'Filter by category...',
      options:
        categoriesData?.results.map((category) => ({
          label: category.name,
          value: category.id,
        })) ?? [],
    },
  ];

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageCount: totalPages,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      pagination: { pageIndex: searchParams.page, pageSize: searchParams.limit },
      columnPinning: { right: ['actions'] },
    },
    filterFields,
    getRowId: (originalRow) => originalRow.id,
    shallow: false, // This ensures server-side updates when URL changes
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
    toast.error('Error', {
      description: error.message ?? 'An error occurred while fetching customers.',
    });
  }

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <ProductTableToolbar table={table} />
        </DataTableToolbar>
      </DataTable>

      <DeleteProductsModal
        open={rowAction?.type === 'delete'}
        onOpenChange={() => {
          setRowAction(null);
        }}
        products={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </div>
  );
};

export default ProductTable;
