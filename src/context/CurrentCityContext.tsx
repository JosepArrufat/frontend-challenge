import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'
import {
  CurrentCityContext,
  currentCityKey,
  type CurrentCityContextValue,
} from './currentCityContext'
import { DEFAULT_USERNAME } from './userContext'
import type { City } from '../types'

export interface CurrentCityProviderProps {
  username: string
  children: ReactNode
}

export function CurrentCityProvider({ username, children }: CurrentCityProviderProps) {
  const isGuest = username === DEFAULT_USERNAME
  const storageKey = currentCityKey(username)
  const [currentCity, setCurrentCityState] = useState<City | null>(() =>
    isGuest ? null : loadJSON<City | null>(storageKey, null),
  )

  useEffect(() => {
    if (isGuest) return
    saveJSON(storageKey, currentCity)
  }, [storageKey, currentCity, isGuest])

  const setCurrentCity = useCallback(
    (city: City | null) => {
      if (isGuest) return
      setCurrentCityState(city)
    },
    [isGuest],
  )
  const clearCurrentCity = useCallback(() => {
    if (isGuest) return
    setCurrentCityState(null)
  }, [isGuest])

  const value = useMemo<CurrentCityContextValue>(
    () => ({ currentCity, setCurrentCity, clearCurrentCity }),
    [currentCity, setCurrentCity, clearCurrentCity],
  )

  return <CurrentCityContext.Provider value={value}>{children}</CurrentCityContext.Provider>
}
