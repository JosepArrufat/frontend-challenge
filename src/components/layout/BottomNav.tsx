import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { NAV_ITEMS } from '../../constants/navItems'

export function BottomNav() {
  return (
    <Bar>
      {NAV_ITEMS.map(({ to, shortLabel, icon: Icon, end }) => (
        <Tab key={to} to={to} end={end}>
          <Icon size={20} />
          <TabLabel>{shortLabel}</TabLabel>
        </Tab>
      ))}
    </Bar>
  )
}

const Bar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  padding: 0.375rem 0.25rem calc(0.375rem + env(safe-area-inset-bottom, 0px));
  background: color-mix(in oklab, ${({ theme }) => theme.color.surface} 88%, transparent);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-top: 1px solid ${({ theme }) => theme.color.border};

  @media (min-width: 1024px) {
    display: none;
  }
`

const Tab = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1875rem;
  flex: 1;
  padding: 0.3125rem 0;
  color: ${({ theme }) => theme.color.mutedForeground};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
  }

  &.active {
    color: ${({ theme }) => theme.color.primary};
  }
`

const TabLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
`
