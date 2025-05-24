import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

export const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  order: parseAsString.withDefault(''),
  sortby: parseAsString.withDefault(''),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
