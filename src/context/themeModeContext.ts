import { createContext } from 'react'

export type ThemeMode = 'dark' | 'light'

export const THEME_MODE_STORAGE_KEY = 'wf:theme-mode'

export interface ThemeModeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)
