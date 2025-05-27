import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { categories } from '@/utils/mock-data.utils';

export async function GET(request: NextRequest) {
  // Extract query parameters
  const searchParams = request.nextUrl.searchParams;

  // Get pagination params
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const skip = parseInt(searchParams.get('skip') ?? '0');

  // Get search param
  const search = searchParams.get('search') ?? '';

  // Filter categories by search term if provided
  let filteredCategories = [...categories];
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCategories = filteredCategories.filter((category) =>
      category.name.toLowerCase().includes(searchLower),
    );
  }

  // Calculate pagination
  const total = filteredCategories.length;
  const adjustedSkip = Math.min(Math.max(0, skip), total);
  const paginatedCategories = filteredCategories.slice(adjustedSkip, adjustedSkip + limit);

  // Simulate network delay to test loading states (optional)
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    results: paginatedCategories,
    extras: {
      limit,
      skip: adjustedSkip,
      total,
    },
  });
}
