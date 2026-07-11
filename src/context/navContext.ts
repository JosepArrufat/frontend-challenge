import { createContext } from 'react'

export interface NavContextValue {
  openNav: () => void
}

export const NavContext = createContext<NavContextValue | null>(null)
