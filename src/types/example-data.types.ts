import type { BaseEntity, BaseParams } from './common.types';

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export type Product = BaseEntity & {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  price: string;
  image: string;
};

export type ProductParams = BaseParams & {
  brands?: string;
  categories?: string;
};
