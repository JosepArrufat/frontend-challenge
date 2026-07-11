import { NavLink } from 'react-router-dom'
import { Home, Globe, Star, Bell, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styled from 'styled-components'

interface TabItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const TABS: TabItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/map', label: 'Map', icon: Globe },
  { to: '/favorites', label: 'Favs', icon: Star },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  return (
    <Bar>
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <Tab key={to} to={to} end={end}>
          <Icon size={20} />
          <TabLabel>{label}</TabLabel>
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
