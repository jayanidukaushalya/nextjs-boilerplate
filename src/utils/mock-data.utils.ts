import type { Brand, Category, Product } from '@/types/example-data.types';

import productData from '@/data/mock-data.json';

// Use static data from JSON file
export const brands: Brand[] = productData.brands;
export const categories: Category[] = productData.categories;
export const products: Product[] = productData.products.map((product) => ({
  ...product,
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt),
}));
