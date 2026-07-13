import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'
import {
  CurrentCityContext,
  currentCityKey,
  type CurrentCityContextValue,
} from './currentCityContext'
import type { City } from '../types'

export interface CurrentCityProviderProps {
  username: string
  children: ReactNode
}

export function CurrentCityProvider({ username, children }: CurrentCityProviderProps) {
  const storageKey = currentCityKey(username)
  const [currentCity, setCurrentCityState] = useState<City | null>(() =>
    loadJSON<City | null>(storageKey, null),
  )

  useEffect(() => {
    saveJSON(storageKey, currentCity)
  }, [storageKey, currentCity])

  const setCurrentCity = useCallback((city: City | null) => setCurrentCityState(city), [])
  const clearCurrentCity = useCallback(() => setCurrentCityState(null), [])

  const value = useMemo<CurrentCityContextValue>(
    () => ({ currentCity, setCurrentCity, clearCurrentCity }),
    [currentCity, setCurrentCity, clearCurrentCity],
  )

  return <CurrentCityContext.Provider value={value}>{children}</CurrentCityContext.Provider>
}
