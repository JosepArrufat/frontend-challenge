import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'
import { UnitContext, type TempUnit, UNIT_STORAGE_KEY } from './unitContext'

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<TempUnit>(() =>
    loadJSON<TempUnit>(UNIT_STORAGE_KEY, 'celsius'),
  )

  useEffect(() => {
    saveJSON(UNIT_STORAGE_KEY, unit)
  }, [unit])

  const setUnit = useCallback((next: TempUnit) => setUnitState(next), [])
  const toggle = useCallback(
    () => setUnitState((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius')),
    [],
  )

  const value = useMemo(() => ({ unit, setUnit, toggle }), [unit, setUnit, toggle])

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>
}
