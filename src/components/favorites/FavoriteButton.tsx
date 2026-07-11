import { Star } from 'lucide-react'
import styled from 'styled-components'
import type { City } from '../../types'
import { useFavorites } from '../../hooks/useFavorites'

export interface FavoriteButtonProps {
  city: City
}

export function FavoriteButton({ city }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(city.id)
  return (
    <Btn
      type="button"
      $active={active}
      aria-pressed={active}
      aria-label={active ? `Remove ${city.name} from favorites` : `Add ${city.name} to favorites`}
      onClick={() => toggleFavorite(city)}
    >
      <Star size={18} aria-hidden />
      {active ? 'Saved' : 'Save'}
    </Btn>
  )
}

const Btn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ $active, theme }) =>
    $active ? theme.color.signatureForeground : theme.color.mutedForeground};
  background: ${({ $active, theme }) => ($active ? theme.color.signature : theme.color.secondary)};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.color.signature : theme.color.border)};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.color.signatureForeground : theme.color.foreground};
  }
`
