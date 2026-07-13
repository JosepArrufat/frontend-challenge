import { NavLink } from 'react-router-dom'
import { CloudSun, Home, Globe, Star, Bell, Settings, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styled from 'styled-components'
import { useUnit } from '../../hooks/useUnit'
import { useUser } from '../../hooks/useUser'
import type { TempUnit } from '../../context/unitContext'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/map', label: 'World Map', icon: Globe },
  { to: '/favorites', label: 'Favorites', icon: Star },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export interface SidebarProps {
  $open: boolean
  onClose: () => void
}

export function Sidebar({ $open, onClose }: SidebarProps) {
  const { unit, setUnit } = useUnit()
  const { username } = useUser()
  return (
    <Aside $open={$open}>
      <Brand>
        <BrandMark>
          <CloudSun size={22} />
        </BrandMark>
        <BrandName>Weather</BrandName>
      </Brand>

      <Nav>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <StyledLink key={to} to={to} end={end} onClick={onClose}>
            <Icon size={18} />
            <span>{label}</span>
          </StyledLink>
        ))}
      </Nav>

      <UnitToggle value={unit} onChange={setUnit} />

      <Profile>
        <Avatar>
          <User size={18} />
        </Avatar>
        <ProfileName>{username}</ProfileName>
      </Profile>
    </Aside>
  )
}

interface UnitToggleProps {
  value: TempUnit
  onChange: (unit: TempUnit) => void
}

function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <ToggleGroup role="group" aria-label="Temperature unit">
      <ToggleBtn
        type="button"
        $active={value === 'celsius'}
        aria-pressed={value === 'celsius'}
        onClick={() => onChange('celsius')}
      >
        °C
      </ToggleBtn>
      <ToggleBtn
        type="button"
        $active={value === 'fahrenheit'}
        aria-pressed={value === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
      >
        °F
      </ToggleBtn>
    </ToggleGroup>
  )
}

const Aside = styled.aside<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 1.5rem;
  width: 16rem;
  padding: 1.5rem 1rem;
  background: linear-gradient(
    180deg,
    color-mix(
      in oklab,
      ${({ theme }) => theme.color.sidebar} 100%,
      ${({ theme }) => theme.color.background} 30%
    ),
    ${({ theme }) => theme.color.sidebar}
  );
  border-right: 1px solid ${({ theme }) => theme.color.border};

  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.25s ease;

  ${({ $open }) => $open && 'transform: translateX(0);'}

  @media (min-width: 1024px) {
    position: sticky;
    transform: none;
    transition: none;
    ${({ $open }) => !$open && 'display: none;'}
  }
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.5rem;
`

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.primaryForeground};
  background: linear-gradient(160deg, oklch(0.72 0.2 256), oklch(0.5 0.2 256));
  box-shadow:
    ${({ theme }) => theme.glow.primary},
    inset 0 1px 0 oklch(1 0 0 / 0.28);
`

const BrandName = styled.span`
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
`

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.mutedForeground};
  font-size: 0.9375rem;
  font-weight: 500;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }

  &.active {
    color: ${({ theme }) => theme.color.foreground};
    background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 20%, transparent);
    box-shadow: inset 0 0 0 1px
      color-mix(in oklab, ${({ theme }) => theme.color.primary} 45%, transparent);
  }
`

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: auto;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.muted};
  border: 1px solid ${({ theme }) => theme.color.border};
`

const ToggleBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.4375rem 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? theme.color.primaryForeground : theme.color.mutedForeground)};
  background: ${({ $active, theme }) => ($active ? theme.color.primary : 'transparent')};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    color: ${({ $active, theme }) => ($active ? theme.color.primaryForeground : theme.color.foreground)};
  }
`

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.muted};
  border: 1px solid ${({ theme }) => theme.color.border};
`

const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.primaryForeground};
  background: linear-gradient(160deg, oklch(0.7 0.18 52), oklch(0.55 0.16 40));
  flex-shrink: 0;
`

const ProfileName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
