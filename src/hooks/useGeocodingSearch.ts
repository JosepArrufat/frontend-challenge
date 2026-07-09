import { useQuery } from '@tanstack/react-query'
import { searchCities } from '../lib/geocoding'
import { MIN_SEARCH_LENGTH } from '../constants'
import type { City } from '../types'

export function useGeocodingSearch(query: string) {
  const trimmed = query.trim()
  const enabled = trimmed.length >= MIN_SEARCH_LENGTH

  return useQuery<City[]>({
    queryKey: ['geocoding', trimmed],
    queryFn: ({ signal }) => searchCities(trimmed, signal),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
    retry: false,
  })
}
