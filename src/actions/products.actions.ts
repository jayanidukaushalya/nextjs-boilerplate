import Api from '@/configs/api.config';
import { QueryKeys } from '@/constants';
import { IBaseParams, IPaginatedResponseDTO } from '@/types';
import { IProduct } from '@/types/mock-data.types';
import { getQueryClient } from '@/utils/query-utils';

export const getProducts = async (params?: IBaseParams) => {
  const response = await Api.get<IPaginatedResponseDTO<IProduct>>('/example/product', {
    params,
  });
  return response.data;
};

export const prefetchProducts = (params?: IBaseParams) => {
  const queryClient = getQueryClient();
  return queryClient.prefetchQuery({
    queryKey: [QueryKeys.PRODUCTS, ...(params ? Object.values(params) : [])],
    queryFn: () => getProducts(params).then((res) => res.results),
  });
};
