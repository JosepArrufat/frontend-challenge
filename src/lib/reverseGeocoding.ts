import { REVERSE_GEOCODING_URL } from '../constants'
import { fetchJson } from './api'
import type { City, ReverseGeocodingResponse } from '../types'

function geolocationCityId(latitude: number, longitude: number): number {
  const latKey = Math.round((latitude + 90) * 1000)
  const lonKey = Math.round((longitude + 180) * 1000)
  return -(latKey * 1_000_000 + lonKey)
}

export async function reverseGeocodeCity(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<City> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'en',
  })

  const data = await fetchJson<ReverseGeocodingResponse>(
    `${REVERSE_GEOCODING_URL}?${params.toString()}`,
    { signal },
  )

  return {
    id: geolocationCityId(latitude, longitude),
    name: data.city || data.locality || data.principalSubdivision || 'Current location',
    country: data.countryName ?? '',
    countryCode: (data.countryCode ?? '').toUpperCase(),
    latitude,
    longitude,
  }
}
