import { createContext } from 'react'
import type { FavoriteCity } from '../types'

export interface FavoritesState {
  items: FavoriteCity[]
}

export type FavoritesAction = { type: 'add'; city: FavoriteCity } | { type: 'remove'; id: number }

export interface FavoritesContextValue {
  favorites: FavoriteCity[]
  addFavorite: (city: FavoriteCity) => void
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'add':
      if (state.items.some((city) => city.id === action.city.id)) return state
      return { items: [...state.items, action.city] }
    case 'remove':
      return { items: state.items.filter((city) => city.id !== action.id) }
    default:
      return state
  }
}
