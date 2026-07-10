import { useState } from 'react'
import styled from 'styled-components'
import type { DailyEntry } from '../../types'
import { formatDayShort, formatDate, formatTemp, convertTemp } from '../../lib/format'
import { getWeatherInfo } from '../../lib/weatherCodes'
import { useUnit } from '../../hooks/useUnit'
import { DAILY_PAGE_SIZE } from '../../constants'
import { WeatherIcon } from '../ui/WeatherIcon'
import { Skeleton } from '../ui/Skeleton'
import { ForecastPagination } from './ForecastPagination'

export interface DailyForecastProps {
  entries: DailyEntry[]
}

export function DailyForecast({ entries }: DailyForecastProps) {
  const { unit } = useUnit()
  const [page, setPage] = useState(1)
  if (entries.length === 0) return null

  const totalPages = Math.ceil(entries.length / DAILY_PAGE_SIZE)
  const start = (page - 1) * DAILY_PAGE_SIZE
  const pageEntries = entries.slice(start, start + DAILY_PAGE_SIZE)

  const rangeMin = Math.min(...pageEntries.map((e) => convertTemp(e.min, unit)))
  const rangeMax = Math.max(...pageEntries.map((e) => convertTemp(e.max, unit)))
  const rangeSpan = rangeMax - rangeMin || 1

  function pct(value: number): number {
    return ((convertTemp(value, unit) - rangeMin) / rangeSpan) * 100
  }

  return (
    <Panel>
      <Heading>30-day forecast</Heading>
      <RowList>
        {pageEntries.map((entry) => {
          const info = getWeatherInfo(entry.weatherCode)
          const left = pct(entry.min)
          const width = pct(entry.max) - left
          return (
            <Row key={entry.date} $today={entry.isToday}>
              <DateCell>
                <DayName>{formatDayShort(entry.date)}</DayName>
                <DayDate>{formatDate(entry.date)}</DayDate>
                {entry.isToday && <Tag $tone="primary">Today</Tag>}
              </DateCell>
              <RowIcon name={info.icon} size={20} />
              <MinTemp>{formatTemp(entry.min, unit)}</MinTemp>
              <RangeBar>
                <RangeFill
                  $left={left}
                  $width={width}
                  aria-label={`Low ${formatTemp(entry.min, unit)}, high ${formatTemp(entry.max, unit)}`}
                />
              </RangeBar>
              <MaxTemp>{formatTemp(entry.max, unit)}</MaxTemp>
            </Row>
          )
        })}
      </RowList>
      <ForecastPagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </Panel>
  )
}

export function DailyForecastSkeleton() {
  return (
    <Panel aria-busy="true" aria-label="Loading 30-day forecast">
      <Heading>30-day forecast</Heading>
      <RowList>
        {Array.from({ length: 5 }).map((_, i) => (
          <Row key={i} $today={false}>
            <DateCell>
              <Skeleton width="2rem" height="0.875rem" />
              <Skeleton width="2.5rem" height="0.75rem" />
            </DateCell>
            <Skeleton width="1.25rem" height="1.25rem" radius="9999px" />
            <Skeleton width="2.5rem" height="0.9rem" />
            <Skeleton width="100%" height="0.375rem" radius="9999px" />
            <Skeleton width="2.5rem" height="0.9rem" />
          </Row>
        ))}
      </RowList>
    </Panel>
  )
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const RowList = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div<{ $today: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  &:last-child {
    border-bottom: none;
  }

  background: ${({ $today, theme }) =>
    $today ? `color-mix(in oklab, ${theme.color.primary} 8%, transparent)` : 'transparent'};
  border-radius: ${({ $today, theme }) => ($today ? theme.radius.sm : '0')};
`

const DateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 9rem;
  flex-shrink: 0;
  white-space: nowrap;
`

const DayName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const DayDate = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  font-variant-numeric: tabular-nums;
`

const Tag = styled.span<{ $tone: 'primary' }>`
  padding: 0.0625rem 0.375rem;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.5625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.primary};
  background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 16%, transparent);
  border: 1px solid color-mix(in oklab, ${({ theme }) => theme.color.primary} 40%, transparent);
`

const RowIcon = styled(WeatherIcon)`
  color: ${({ theme }) => theme.color.foreground};
  flex-shrink: 0;
`

const MinTemp = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  font-variant-numeric: tabular-nums;
  width: 2.75rem;
  text-align: right;
  flex-shrink: 0;
`

const RangeBar = styled.div`
  flex: 1;
  height: 0.375rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.color.muted};
  overflow: hidden;
  min-width: 3rem;
`

const RangeFill = styled.div<{ $left: number; $width: number }>`
  position: relative;
  height: 100%;
  margin-left: ${({ $left }) => $left}%;
  width: ${({ $width }) => $width}%;
  min-width: 0.5rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, oklch(0.6 0.18 250), oklch(0.72 0.19 52));
`

const MaxTemp = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.foreground};
  font-variant-numeric: tabular-nums;
  width: 2.75rem;
  text-align: right;
  flex-shrink: 0;
`
