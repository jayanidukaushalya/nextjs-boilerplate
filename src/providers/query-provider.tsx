'use client';

import { getQueryClient } from '@/utils/query-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const QueryProvider = ({ children }: Props) => {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
