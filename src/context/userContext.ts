import { createContext } from 'react'

export const USERNAME_STORAGE_KEY = 'wf:username'
export const DEFAULT_USERNAME = 'Guest'

export interface UserContextValue {
  username: string
  setUsername: (name: string) => void
  logOut: () => void
}

export const UserContext = createContext<UserContextValue | null>(null)
