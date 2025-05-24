import DeleteProductsModal from '@/components/modals/delete-products-modal';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types/mock-data.types';
import { exportTableToCSV } from '@/utils/export-utils';
import { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';

type Props = {
  table: Table<IProduct>;
};

const ProductTableToolbar = ({ table }: Props) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex gap-2 items-center">
      {selectedRows.length > 0 ? (
        <DeleteProductsModal
          products={selectedRows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'customers',
            excludeColumns: ['select', 'actions'],
            onlySelected: selectedRows.length > 0,
          })
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Export {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
};

export default ProductTableToolbar;
