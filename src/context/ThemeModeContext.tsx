import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'
import { ThemeModeContext, type ThemeMode, THEME_MODE_STORAGE_KEY } from './themeModeContext'

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    loadJSON<ThemeMode>(THEME_MODE_STORAGE_KEY, 'dark'),
  )

  useEffect(() => {
    saveJSON(THEME_MODE_STORAGE_KEY, mode)
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => setModeState(next), [])
  const toggle = useCallback(() => setModeState((prev) => (prev === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, setMode, toggle])

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}
