export interface BaseParams {
  limit?: number;
  page?: number;
  sortby?: string;
  order?: string;
  search?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommonResponseDTO<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponseDTO<T, U = BasePaginationExtras> {
  results: T[];
  extras: U;
}

export interface BasePaginationExtras {
  total: number;
  limit?: number;
  skip?: number;
}
