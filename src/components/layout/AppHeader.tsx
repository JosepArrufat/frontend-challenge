import { NavLink } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import styled from 'styled-components'

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  background: color-mix(in oklab, ${({ theme }) => theme.color.background} 72%, transparent);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.primaryForeground};
  background: linear-gradient(160deg, oklch(0.72 0.2 256), oklch(0.5 0.2 256));
  box-shadow:
    ${({ theme }) => theme.glow.primary},
    inset 0 1px 0 oklch(1 0 0 / 0.28);
`

const Nav = styled.nav`
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
`

const StyledLink = styled(NavLink)`
  padding: 0.4375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.mutedForeground};
  font-weight: 500;
  font-size: 0.875rem;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }

  &.active {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.secondary};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.color.border};
  }
`

export function AppHeader() {
  return (
    <Header>
      <Brand>
        <BrandMark>
          <Cloud size={18} />
        </BrandMark>
        Weather
      </Brand>
      <Nav>
        <StyledLink to="/" end>
          Home
        </StyledLink>
        <StyledLink to="/favorites">Favorites</StyledLink>
      </Nav>
    </Header>
  )
}
