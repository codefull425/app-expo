import { useQuery } from '@tanstack/react-query';
import { fetchCatalog } from '../api/catalog';

export const catalogQueryKey = ['catalog'] as const;

export function useCatalog() {
  return useQuery({
    queryKey: catalogQueryKey,
    queryFn: fetchCatalog,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}
