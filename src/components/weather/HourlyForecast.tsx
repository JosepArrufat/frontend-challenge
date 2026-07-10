import styled from 'styled-components'
import type { HourlyEntry } from '../../types'
import { formatHour, formatTemp } from '../../lib/format'
import { getWeatherInfo } from '../../lib/weatherCodes'
import { useUnit } from '../../hooks/useUnit'
import { WeatherIcon } from '../ui/WeatherIcon'
import { Skeleton } from '../ui/Skeleton'

export interface HourlyForecastProps {
  entries: HourlyEntry[]
}

export function HourlyForecast({ entries }: HourlyForecastProps) {
  const { unit } = useUnit()
  if (entries.length === 0) return null
  return (
    <Panel>
      <Heading>Next 24 hours</Heading>
      <Strip role="list" aria-label="Hourly forecast">
        {entries.map((entry) => {
          const info = getWeatherInfo(entry.weatherCode)
          const label = entry.isNow ? 'Now' : formatHour(entry.time)
          return (
            <Chip
              key={entry.time}
              role="listitem"
              $now={entry.isNow}
              aria-label={`${label}, ${info.label}, ${formatTemp(entry.temperature, unit)}`}
            >
              <Time $now={entry.isNow}>{label}</Time>
              <ChipIcon name={info.icon} size={20} />
              <ChipTemp>{formatTemp(entry.temperature, unit)}</ChipTemp>
            </Chip>
          )
        })}
      </Strip>
    </Panel>
  )
}

export function HourlyForecastSkeleton() {
  return (
    <Panel aria-busy="true" aria-label="Loading hourly forecast">
      <Heading>Next 24 hours</Heading>
      <Strip>
        {Array.from({ length: 8 }).map((_, i) => (
          <Chip key={i} $now={false}>
            <Skeleton width="2rem" height="0.75rem" />
            <Skeleton width="1.25rem" height="1.25rem" radius="9999px" />
            <Skeleton width="2rem" height="0.9rem" />
          </Chip>
        ))}
      </Strip>
    </Panel>
  )
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.shadow.card};
`

const Heading = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const Strip = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
`

const Chip = styled.div<{ $now: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4375rem;
  flex-shrink: 0;
  width: 4.25rem;
  padding: 0.75rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ $now, theme }) =>
    $now ? `color-mix(in oklab, ${theme.color.primary} 18%, transparent)` : theme.color.card};
  border: 1px solid ${({ $now, theme }) => ($now ? theme.color.primary : theme.color.border)};
  scroll-snap-align: start;
`

const Time = styled.span<{ $now: boolean }>`
  font-size: 0.75rem;
  font-weight: ${({ $now }) => ($now ? 700 : 500)};
  color: ${({ $now, theme }) => ($now ? theme.color.primary : theme.color.mutedForeground)};
  font-variant-numeric: tabular-nums;
`

const ChipIcon = styled(WeatherIcon)`
  color: ${({ theme }) => theme.color.foreground};
`

const ChipTemp = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`
