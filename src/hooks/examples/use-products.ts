import type { BaseParams } from '@/types/common.types';

import { useQuery } from '@tanstack/react-query';

import { getProducts } from '@/actions/example.actions';
import { QueryKeys } from '@/constants/query-keys.constants';

export const useProducts = (params?: BaseParams) => {
  return useQuery({
    queryKey: [QueryKeys.PRODUCTS, ...(params ? Object.values(params) : [])],
    queryFn: () => getProducts(params).then((res) => res.data),
  });
};
