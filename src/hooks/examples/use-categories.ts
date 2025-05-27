import type { BaseParams } from '@/types/common.types';

import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/actions/example.actions';
import { QueryKeys } from '@/constants/query-keys.constants';

export const useCategories = (params?: BaseParams) => {
  return useQuery({
    queryKey: [QueryKeys.CATEGORIES, ...(params ? Object.values(params) : [])],
    queryFn: () => getCategories(params).then((res) => res.data),
  });
};
