import Api from '@/configs/api.config';
import { IBaseParams, IPaginatedResponseDTO } from '@/types';
import { ICategory } from '@/types/mock-data.types';

export const getCategories = async (params?: IBaseParams) => {
  const response = await Api.get<IPaginatedResponseDTO<ICategory>>('/example/category', {
    params,
  });
  return response.data;
};
