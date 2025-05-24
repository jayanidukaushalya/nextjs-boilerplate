import productData from '@/data/mock-data.json';
import { IBrand, ICategory, IProduct } from '@/types/mock-data.types';

// Use static data from JSON file
export const brands: IBrand[] = productData.brands;
export const categories: ICategory[] = productData.categories;
export const products: IProduct[] = productData.products.map((product) => ({
  ...product,
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt),
}));
