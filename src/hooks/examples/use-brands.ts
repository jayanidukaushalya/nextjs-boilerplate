import type { BaseParams } from '@/types/common.types';

import { useQuery } from '@tanstack/react-query';

import { getBrands } from '@/actions/example.actions';
import { QueryKeys } from '@/constants/query-keys.constants';

export const useBrands = (params?: BaseParams) => {
  return useQuery({
    queryKey: [QueryKeys.BRANDS, ...(params ? Object.values(params) : [])],
    queryFn: () => getBrands(params).then((res) => res.data),
  });
};
