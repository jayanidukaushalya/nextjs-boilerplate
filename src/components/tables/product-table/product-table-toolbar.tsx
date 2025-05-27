'use client';

import type { UseRowSelectionReturn } from '@/hooks/use-row-selection';
import type { Product } from '@/types/example-data.types';
import type { Table } from '@tanstack/react-table';

import { useCallback, useMemo } from 'react';

import { Download, Tag, Trash, X } from 'lucide-react';
import { useQueryStates } from 'nuqs';

import DataTableSearch from '@/components/common/data-table/data-table-search';
import DataTableViewOptions from '@/components/common/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { useBrands } from '@/hooks/examples/use-brands';
import { useCategories } from '@/hooks/examples/use-categories';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { productSearchParamsParsers } from '@/nuqs/product.nuqs';
import { cn } from '@/utils/tailwind-utils';

import DataTableFacetedFilter from '../../common/data-table/data-table-faceted-filter';

import DeleteProductsModal from './delete-products-modal';

type ProductTableToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The table instance
   */
  table: Table<Product>;

  /**
   * Row selection hook return value
   */
  rowSelection: UseRowSelectionReturn<Product>;

  /**
   * Debounce time (ms) for filter updates to enhance performance during rapid input.
   * @default 300
   */
  debounceMs?: number;
};

const ProductTableToolbar = ({
  table,
  rowSelection,
  className,
  debounceMs = 300,
  ...props
}: ProductTableToolbarProps) => {
  const { data: categoriesData } = useCategories();
  const categories = useMemo(
    () =>
      categoriesData?.results.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? [],
    [categoriesData],
  );

  const { data: brandsData } = useBrands();
  const brands = useMemo(
    () =>
      brandsData?.results.map((brand) => ({
        label: brand.name,
        value: brand.id,
      })) ?? [],
    [brandsData],
  );

  // Use nuqs to manage filter values directly in URL with the same parsers as the parent component
  const [searchParams, setSearchParams] = useQueryStates(productSearchParamsParsers, {
    history: 'replace',
    scroll: false,
    shallow: true,
  });

  // Create debounced version of setSearchParams for search inputs
  const debouncedSetSearchParams = useDebouncedCallback(setSearchParams, debounceMs);

  // Check if any filters are active
  const isFiltered = useMemo(() => {
    return (
      !!searchParams.name.trim() ||
      (searchParams.category && searchParams.category.length > 0) ||
      (searchParams.brand && searchParams.brand.length > 0)
    );
  }, [searchParams]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    void setSearchParams({
      name: '',
      category: [],
      brand: [],
      page: 1,
    });
  }, [setSearchParams]);

  return (
    <div
      className={cn('flex flex-wrap gap-2 justify-between items-center py-1 w-full', className)}
      {...props}
    >
      <div className="flex flex-wrap flex-1 gap-2 items-center">
        {/* Search filters */}
        <DataTableSearch
          key="search"
          placeholder="Search here..."
          searchKey={searchParams.name}
          onSearchKeyChange={(searchKey) => {
            debouncedSetSearchParams({
              name: searchKey,
              page: 1,
            });
          }}
        />

        {/* Faceted filters */}
        <DataTableFacetedFilter
          key="category"
          title="Category"
          icon={Tag}
          options={categories}
          selectedValues={searchParams.category ?? []}
          onValuesChange={(values) => {
            void setSearchParams({
              category: values,
              page: 1,
            });
          }}
        />

        <DataTableFacetedFilter
          key="brand"
          title="Brand"
          options={brands}
          selectedValues={searchParams.brand ?? []}
          onValuesChange={(values) => {
            void setSearchParams({
              brand: values,
              page: 1,
            });
          }}
        />

        {/* Reset filters button */}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="secondary"
            className="px-2 h-8 lg:px-3"
            onClick={resetFilters}
          >
            <span className="text-xs">Reset</span>
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Table actions */}
      <div className="flex gap-2 items-center">
        {rowSelection.selectedCount > 0 ? (
          <>
            <DeleteProductsModal
              products={rowSelection.getSelectedRows()}
              onSuccess={rowSelection.clearSelections}
              selectionState={rowSelection.getSelectionState()}
            >
              <Button variant="outline" size="sm">
                <Trash className="mr-1 size-4" aria-hidden="true" />
                Remove ({rowSelection.selectedCount})
              </Button>
            </DeleteProductsModal>

            <Button variant="outline" size="sm">
              <Download className="size-4 mr-1" aria-hidden="true" />
              Export ({rowSelection.selectedCount})
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              //  TODO: handle export
            }}
          >
            <Download className="size-4 mr-1" aria-hidden="true" />
            Export
          </Button>
        )}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
};

export default ProductTableToolbar;
