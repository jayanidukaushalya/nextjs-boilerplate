import { getBrands } from '@/actions/brands.actions';
import { QueryKeys } from '@/constants';
import { IBaseParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useBrands = (params?: IBaseParams) => {
  return useQuery({
    queryKey: [QueryKeys.BRANDS, ...(params ? Object.values(params) : [])],
    queryFn: () => getBrands(params),
  });
};
