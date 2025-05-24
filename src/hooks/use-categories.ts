import { getCategories } from '@/actions/categories.actions';
import { QueryKeys } from '@/constants';
import { IBaseParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useCategories = (params?: IBaseParams) => {
  return useQuery({
    queryKey: [QueryKeys.CATEGORIES, ...(params ? Object.values(params) : [])],
    queryFn: () => getCategories(params),
  });
};
