import { getProducts } from '@/actions/products.actions';
import { QueryKeys } from '@/constants';
import { IBaseParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useProducts = (params?: IBaseParams) => {
  return useQuery({
    queryKey: [QueryKeys.PRODUCTS, ...(params ? Object.values(params) : [])],
    queryFn: () => getProducts(params),
  });
};
