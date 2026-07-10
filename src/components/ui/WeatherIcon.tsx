import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
}

export interface WeatherIconProps {
  name: string
  size?: number
  className?: string
}

export function WeatherIcon({ name, size = 24, className }: WeatherIconProps) {
  const Icon = ICONS[name] ?? Cloud
  return <Icon size={size} className={className} aria-hidden />
}
