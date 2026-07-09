import { useReducer, type ReactNode } from 'react'
import { FavoritesContext, favoritesReducer, type FavoritesContextValue } from './favoritesContext'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] })

  const value: FavoritesContextValue = {
    favorites: state.items,
    addFavorite: (city) => dispatch({ type: 'add', city }),
    removeFavorite: (id) => dispatch({ type: 'remove', id }),
    isFavorite: (id) => state.items.some((city) => city.id === id),
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
