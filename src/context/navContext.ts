import { createContext } from 'react'

export interface NavContextValue {
  openNav: () => void
  toggleNav: () => void
  closeNav: () => void
}

export const NavContext = createContext<NavContextValue | null>(null)
