import type { City } from '../types'

export function cityKey(city: Pick<City, 'name' | 'countryCode'>): string {
  return `${city.name.toLowerCase().trim()}|${city.countryCode.toLowerCase().trim()}`
}
