import { useQuery } from '@tanstack/react-query'
import { api } from './api'

/** Global chrome data (header, menus, announcement bar). Cached for the session. */
export function useNavigation() {
  return useQuery({
    queryKey: ['navigation'],
    queryFn: api.navigation,
    staleTime: 10 * 60_000,
  })
}

/** Header/top-nav categories: real product categories, excluding curated listings. */
export const CURATED_SLUGS = ['new-arrivals', 'best-sellers']
