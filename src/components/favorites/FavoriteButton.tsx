import { Star } from 'lucide-react'
import styled from 'styled-components'
import type { City } from '../../types'
import { useFavorites } from '../../hooks/useFavorites'
import { useUser } from '../../hooks/useUser'
import { DEFAULT_USERNAME } from '../../context/userContext'

export interface FavoriteButtonProps {
  city: City
  iconOnly?: boolean
}

export function FavoriteButton({ city, iconOnly = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { username } = useUser()

  if (username === DEFAULT_USERNAME) return null

  const active = isFavorite(city)
  const label = active ? `Remove ${city.name} from favorites` : `Add ${city.name} to favorites`

  if (iconOnly) {
    return (
      <IconBtn
        type="button"
        $active={active}
        aria-pressed={active}
        aria-label={label}
        onClick={() => toggleFavorite(city)}
      >
        <Star size={16} aria-hidden fill={active ? 'currentColor' : 'none'} />
      </IconBtn>
    )
  }

  return (
    <Btn
      type="button"
      $active={active}
      aria-pressed={active}
      aria-label={label}
      onClick={() => toggleFavorite(city)}
    >
      <Star size={18} aria-hidden fill={active ? 'currentColor' : 'none'} />
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

const IconBtn = styled.button<{ $active: boolean }>`
  display: inline-grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ $active, theme }) => ($active ? theme.color.signature : theme.color.mutedForeground)};
  background: transparent;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ $active, theme }) => ($active ? theme.color.signature : theme.color.foreground)};
    background: ${({ theme }) => theme.color.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
  }
`
