import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'
import { UserContext, USERNAME_STORAGE_KEY, DEFAULT_USERNAME } from './userContext'

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string>(() =>
    loadJSON<string>(USERNAME_STORAGE_KEY, DEFAULT_USERNAME),
  )

  useEffect(() => {
    saveJSON(USERNAME_STORAGE_KEY, username)
  }, [username])

  const setUsername = useCallback((name: string) => {
    const trimmed = name.trim()
    setUsernameState(trimmed.length > 0 ? trimmed : DEFAULT_USERNAME)
  }, [])

  const logOut = useCallback(() => setUsernameState(DEFAULT_USERNAME), [])

  const value = useMemo(() => ({ username, setUsername, logOut }), [username, setUsername, logOut])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
