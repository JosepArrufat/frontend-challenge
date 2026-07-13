import { createContext } from 'react'
import { DEFAULT_USERNAME } from './userContext'
import type { City } from '../types'

export const CURRENT_CITY_STORAGE_KEY_PREFIX = 'wf:current-city:v1'

export interface CurrentCityContextValue {
  currentCity: City | null
  setCurrentCity: (city: City | null) => void
  clearCurrentCity: () => void
}

export function currentCityKey(username: string): string {
  const safeUsername = username.trim() || DEFAULT_USERNAME
  return `${CURRENT_CITY_STORAGE_KEY_PREFIX}:${safeUsername}`
}

export const CurrentCityContext = createContext<CurrentCityContextValue | null>(null)
