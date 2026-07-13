import { createContext } from 'react'
import type { FavoriteCity } from '../types'
import { cityKey } from '../lib/city'

export interface FavoritesState {
  items: FavoriteCity[]
}

export type FavoritesAction =
  | { type: 'add'; city: FavoriteCity }
  | { type: 'remove'; key: string }
  | { type: 'toggle'; city: FavoriteCity }

export interface FavoritesContextValue {
  favorites: FavoriteCity[]
  addFavorite: (city: FavoriteCity) => void
  removeFavorite: (key: string) => void
  toggleFavorite: (city: FavoriteCity) => void
  isFavorite: (city: FavoriteCity) => boolean
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'add':
      if (state.items.some((city) => cityKey(city) === cityKey(action.city))) return state
      return { items: [...state.items, action.city] }
    case 'remove':
      return { items: state.items.filter((city) => cityKey(city) !== action.key) }
    case 'toggle': {
      const key = cityKey(action.city)
      if (state.items.some((city) => cityKey(city) === key)) {
        return { items: state.items.filter((city) => cityKey(city) !== key) }
      }
      return { items: [...state.items, action.city] }
    }
    default:
      return state
  }
}

export function favoritesKey(username: string): string {
  return `wf:favorites:${username}`
}
