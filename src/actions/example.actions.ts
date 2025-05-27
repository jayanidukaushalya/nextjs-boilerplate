import type { BaseParams, CommonResponseDTO, PaginatedResponseDTO } from '@/types/common.types';
import type { Brand, Category, Product } from '@/types/example-data.types';

import Api from '@/configs/api.config';
import { QueryKeys } from '@/constants/query-keys.constants';
import { getQueryClient } from '@/utils/query-utils';

export const getBrands = async (params?: BaseParams) => {
  try {
    const response = await Api.get<CommonResponseDTO<PaginatedResponseDTO<Brand>>>(
      '/example/brand',
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getCategories = async (params?: BaseParams) => {
  try {
    const response = await Api.get<CommonResponseDTO<PaginatedResponseDTO<Category>>>(
      '/example/category',
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProducts = async (params?: BaseParams) => {
  try {
    const response = await Api.get<CommonResponseDTO<PaginatedResponseDTO<Product>>>(
      '/example/product',
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const prefetchProducts = (params?: BaseParams) => {
  const queryClient = getQueryClient();
  return queryClient.prefetchQuery({
    queryKey: [QueryKeys.PRODUCTS, ...(params ? Object.values(params) : [])],
    queryFn: () =>
      getProducts(params).catch((error) => {
        console.error('Error prefetching products:', error);
        throw error;
      }),
  });
};
