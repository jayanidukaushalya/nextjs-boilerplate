export interface IBaseParams {
  limit?: number;
  page?: number;
  sortby?: string;
  order?: string;
  search?: string;
}

export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommonResponseDTO<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface IPaginatedResponseDTO<T, U = IBasePaginationExtras> {
  results: T[];
  extras: U;
}

export interface IBasePaginationExtras {
  total: number;
  limit?: number;
  skip?: number;
}
