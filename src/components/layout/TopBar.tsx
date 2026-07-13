import { Link } from 'react-router-dom'
import { Settings, Sun, Moon } from 'lucide-react'
import styled from 'styled-components'
import { Search } from '../search/Search'
import { AuthWidget } from './AuthWidget'
import { useThemeMode } from '../../hooks/useThemeMode'
import type { City } from '../../types'

export interface TopBarProps {
  onSelectCity: (city: City) => void
}

export function TopBar({ onSelectCity }: TopBarProps) {
  const { mode, toggle } = useThemeMode()
  return (
    <Bar>
      <SearchSlot>
        <Search onSelect={onSelectCity} />
      </SearchSlot>
      <Actions>
        <AuthWidget />
        <IconButton as={Link} to="/settings" aria-label="Settings">
          <Settings size={18} />
        </IconButton>
        <IconButton
          onClick={toggle}
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
      </Actions>
    </Bar>
  )
}

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 30;
  display: none;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem 1rem 4rem;
  background: transparent;

  @media (min-width: 1024px) {
    display: flex;
  }
`

const SearchSlot = styled.div`
  flex: 1;
  max-width: 30rem;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  padding: 0.375rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: color-mix(in oklab, ${({ theme }) => theme.color.surface} 70%, transparent);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
`

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.mutedForeground};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }
`
