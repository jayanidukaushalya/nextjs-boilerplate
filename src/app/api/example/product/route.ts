import { brands, categories, products } from '@/utils/mock-data.utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract query parameters
  const searchParams = request.nextUrl.searchParams;

  // Get pagination params - convert page to skip
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const skip = (page - 1) * limit;

  // Get sorting params
  const sortby = searchParams.get('sortby') ?? '';
  const order = searchParams.get('order') ?? 'asc';

  // Get filter params
  const search = searchParams.get('name') ?? '';

  const categoryIds = searchParams.getAll('category[]');
  const brandIds = searchParams.getAll('brand[]');

  // Apply filters
  let filteredProducts = [...products];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchLower),
    );
  }

  // Category filter
  if (categoryIds.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      categoryIds.includes(product.category.id),
    );
  }

  // Brand filter
  if (brandIds.length > 0) {
    filteredProducts = filteredProducts.filter((product) => brandIds.includes(product.brand.id));
  }

  // Apply sorting
  if (sortby) {
    filteredProducts.sort((a: any, b: any) => {
      // Handle nested properties like brand.name
      const path = sortby.split('.');
      let aValue: any = a;
      let bValue: any = b;

      // Navigate through nested properties
      for (const key of path) {
        aValue = aValue[key];
        bValue = bValue[key];
      }

      // Compare values based on their type
      if (typeof aValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }

  // Calculate pagination
  const total = filteredProducts.length;

  // Apply pagination
  const paginatedProducts = filteredProducts.slice(skip, skip + limit);

  // Simulate network delay to test loading states (optional)
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    results: paginatedProducts,
    extras: {
      limit,
      page,
      total,
      categories: categories,
      brands: brands,
    },
  });
}
