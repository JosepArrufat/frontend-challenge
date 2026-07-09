import { fetchJson } from './api'
import { GEOCODING_URL, SEARCH_RESULTS_COUNT, MIN_SEARCH_LENGTH } from '../constants'
import type { City, GeocodingResponse } from '../types'

export async function searchCities(name: string): Promise<City[]> {
  const trimmed = name.trim()
  if (trimmed.length < MIN_SEARCH_LENGTH) return []

  const params = new URLSearchParams({
    name: trimmed,
    count: String(SEARCH_RESULTS_COUNT),
    language: 'en',
    format: 'json',
  })

  const data = await fetchJson<GeocodingResponse>(`${GEOCODING_URL}?${params.toString()}`)
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country ?? '',
    countryCode: r.country_code ?? '',
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}
