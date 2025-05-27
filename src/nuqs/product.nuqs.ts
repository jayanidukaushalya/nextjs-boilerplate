import { createSearchParamsCache, parseAsArrayOf, parseAsString } from 'nuqs/server';

import { searchParamsParsers } from '.';

export const productSearchParamsParsers = {
  ...searchParamsParsers,
  name: parseAsString.withDefault(''),
  category: parseAsArrayOf(parseAsString, ','),
  brand: parseAsArrayOf(parseAsString, ','),
};

export const productSearchParamsCache = createSearchParamsCache(productSearchParamsParsers);
