import { useContext } from 'react'
import { UnitContext, type UnitContextValue } from '../context/unitContext'

export function useUnit(): UnitContextValue {
  const ctx = useContext(UnitContext)
  if (!ctx) throw new Error('useUnit must be used within a UnitProvider')
  return ctx
}
