import Api from '@/configs/api.config';
import { IBaseParams, IPaginatedResponseDTO } from '@/types';
import { IBrand } from '@/types/mock-data.types';

export const getBrands = async (params?: IBaseParams) => {
  const response = await Api.get<IPaginatedResponseDTO<IBrand>>('/example/brand', {
    params,
  });
  return response.data;
};
