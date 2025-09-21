'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function FosterApplyProviders({
  queryClient,
  children,
}: {
  queryClient: QueryClient;
  children: React.ReactNode;
}) {
  const shouldShowDevtools = process.env.NODE_ENV !== 'production';

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {shouldShowDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
