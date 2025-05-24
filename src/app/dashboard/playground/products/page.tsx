import { prefetchProducts } from '@/actions/products.actions';
import ProductTable from '@/components/tables/product-table';
import { productSearchParamsCache } from '@/nuqs/product.nuqs';
import { getQueryClient } from '@/utils/query-utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs';

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
};

const ProductsPage = async (props: ProductsPageProps) => {
  const searchParams = await productSearchParamsCache.parse(props.searchParams);

  await prefetchProducts(searchParams);

  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Playground Products</h2>
      </div>

      <HydrationBoundary state={dehydratedState}>
        <ProductTable />
      </HydrationBoundary>
    </div>
  );
};

export default ProductsPage;
