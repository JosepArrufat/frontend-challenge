import { Home, Globe, Star, Bell, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  shortLabel: string
  icon: LucideIcon
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', shortLabel: 'Home', icon: Home, end: true },
  { to: '/map', label: 'World Map', shortLabel: 'Map', icon: Globe },
  { to: '/favorites', label: 'Favorites', shortLabel: 'Favs', icon: Star },
  { to: '/alerts', label: 'Alerts', shortLabel: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
]
