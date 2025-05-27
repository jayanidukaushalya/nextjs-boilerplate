import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import usePagination from '@/hooks/use-pagination';

interface DataTablePaginationProps {
  pageSizeOptions?: number[];
  totalDataCount: number;
  selectedCount?: number;
}

const DataTablePagination = ({
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
  totalDataCount,
  selectedCount = 0,
}: DataTablePaginationProps) => {
  const { pagination, setPagination } = usePagination();

  // Calculate total pages based on totalDataCount and pageSize
  const totalPages = Math.ceil(totalDataCount / pagination.pageSize);

  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = pagination.pageIndex < totalPages - 1;

  return (
    <div className="flex flex-col-reverse items-center justify-between w-full gap-4 p-1 overflow-auto sm:flex-row sm:gap-8">
      <div className="flex-1 text-sm whitespace-nowrap text-slate-500">
        {selectedCount > 0 ? (
          <span className="font-medium">
            {selectedCount} of {totalDataCount} row(s) selected
          </span>
        ) : (
          <span>
            {selectedCount} of {totalDataCount} row(s) selected
          </span>
        )}
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => {
              const size = Number(value);
              setPagination({
                ...pagination,
                pageSize: size,
              });
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Page {pagination.pageIndex + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => {
              setPagination({
                ...pagination,
                pageIndex: 0,
              });
            }}
            disabled={!canPreviousPage}
          >
            <ChevronsLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => {
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex - 1,
              });
            }}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => {
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex + 1,
              });
            }}
            disabled={!canNextPage}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="hidden w-8 h-8 lg:flex"
            onClick={() => {
              setPagination({
                ...pagination,
                pageIndex: totalPages - 1,
              });
            }}
            disabled={!canNextPage}
          >
            <ChevronsRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
