import { useContext } from 'react'
import { CurrentCityContext, type CurrentCityContextValue } from '../context/currentCityContext'

export function useCurrentCity(): CurrentCityContextValue {
  const ctx = useContext(CurrentCityContext)
  if (!ctx) throw new Error('useCurrentCity must be used within a CurrentCityProvider')
  return ctx
}
