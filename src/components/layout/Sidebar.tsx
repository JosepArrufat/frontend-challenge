import { NavLink } from 'react-router-dom'
import { CloudSun, User, X } from 'lucide-react'
import styled from 'styled-components'
import { useUnit } from '../../hooks/useUnit'
import { useUser } from '../../hooks/useUser'
import type { TempUnit } from '../../context/unitContext'
import { NAV_ITEMS } from '../../constants/navItems'

export interface SidebarProps {
  $open: boolean
  onClose: () => void
  onOpen: () => void
}

export function Sidebar({ $open, onClose, onOpen }: SidebarProps) {
  const { unit, setUnit } = useUnit()
  const { username } = useUser()

  function handleNavClick() {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) onClose()
  }

  return (
    <Aside $open={$open}>
      <Header>
        {$open ? (
          <Brand>
            <BrandMark>
              <CloudSun size={22} />
            </BrandMark>
            <BrandName>Weather</BrandName>
          </Brand>
        ) : (
          <BrandMarkBtn type="button" onClick={onOpen} aria-label="Open sidebar">
            <CloudSun size={22} />
          </BrandMarkBtn>
        )}
        {$open && (
          <CloseBtn type="button" onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </CloseBtn>
        )}
      </Header>

      <Nav>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <StyledLink
            key={to}
            to={to}
            end={end}
            $open={$open}
            onClick={handleNavClick}
            title={!$open ? label : undefined}
          >
            <Icon size={18} />
            <Label $open={$open}>{label}</Label>
          </StyledLink>
        ))}
      </Nav>

      {$open && <UnitToggle value={unit} onChange={setUnit} />}

      {$open && (
        <Profile>
          <Avatar>
            <User size={18} />
          </Avatar>
          <ProfileName>{username}</ProfileName>
        </Profile>
      )}
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

  ${({ $open }) => $open && 'transform: translateX(0);'}

  @media (min-width: 1024px) {
    position: sticky;
    transform: none;
    height: 100vh;
    width: 4rem;
    padding: 1.5rem 0.5rem;
    gap: 1rem;

    ${({ $open }) => $open && 'width: 16rem; padding: 1.5rem 1rem; gap: 1.5rem;'}
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 2.25rem;
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.25rem;
`

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.primaryForeground};
  background: linear-gradient(160deg, oklch(0.72 0.2 256), oklch(0.5 0.2 256));
  box-shadow:
    ${({ theme }) => theme.glow.primary},
    inset 0 1px 0 oklch(1 0 0 / 0.28);
`

const BrandMarkBtn = styled.button`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0 auto;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.primaryForeground};
  background: linear-gradient(160deg, oklch(0.72 0.2 256), oklch(0.5 0.2 256));
  box-shadow:
    ${({ theme }) => theme.glow.primary},
    inset 0 1px 0 oklch(1 0 0 / 0.28);
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
  }
`

const BrandName = styled.span`
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`

const CloseBtn = styled.button`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.mutedForeground};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
`

const StyledLink = styled(NavLink)<{ $open: boolean }>`
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

  ${({ $open }) => !$open && 'justify-content: center; padding: 0.625rem 0; gap: 0;'}

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

const Label = styled.span<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'inline' : 'none')};
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
