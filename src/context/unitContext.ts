import { createContext } from 'react'

export type TempUnit = 'celsius' | 'fahrenheit'

export const UNIT_STORAGE_KEY = 'wf:unit'

export interface UnitContextValue {
  unit: TempUnit
  setUnit: (unit: TempUnit) => void
  toggle: () => void
}

export const UnitContext = createContext<UnitContextValue | null>(null)
