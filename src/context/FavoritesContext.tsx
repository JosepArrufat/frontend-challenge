import { useEffect, useReducer, useMemo, type ReactNode } from 'react'
import {
  FavoritesContext,
  favoritesReducer,
  favoritesKey,
  type FavoritesContextValue,
} from './favoritesContext'
import type { FavoriteCity } from '../types'
import { loadJSON, saveJSON } from '../lib/storage'

export interface FavoritesProviderProps {
  username: string
  children: ReactNode
}

export function FavoritesProvider({ username, children }: FavoritesProviderProps) {
  const storageKey = favoritesKey(username)
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] }, (init) => ({
    items: loadJSON<FavoriteCity[]>(storageKey, init.items),
  }))

  useEffect(() => {
    saveJSON(storageKey, state.items)
  }, [storageKey, state.items])

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites: state.items,
      addFavorite: (city) => dispatch({ type: 'add', city }),
      removeFavorite: (id) => dispatch({ type: 'remove', id }),
      toggleFavorite: (city) => dispatch({ type: 'toggle', city }),
      isFavorite: (id) => state.items.some((city) => city.id === id),
    }),
    [state.items],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
