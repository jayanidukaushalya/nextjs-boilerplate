'use client';

import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/utils/query-utils';

interface Props {
  children: ReactNode;
}

const QueryProvider = ({ children }: Props) => {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
