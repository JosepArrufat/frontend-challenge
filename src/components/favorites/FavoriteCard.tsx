import { useNavigate } from 'react-router-dom'
import { Trash2, MapPin } from 'lucide-react'
import styled from 'styled-components'
import type { City } from '../../types'
import { useForecast } from '../../hooks/useForecast'
import { useUnit } from '../../hooks/useUnit'
import { useFavorites } from '../../hooks/useFavorites'
import { getWeatherInfo } from '../../lib/weatherCodes'
import { formatTemp } from '../../lib/format'
import { getDailyEntries } from '../../lib/forecast'
import { WeatherIcon } from '../ui/WeatherIcon'
import { Skeleton } from '../ui/Skeleton'
import { flagEmoji } from '../../lib/flag'
import { cityKey } from '../../lib/city'

export interface FavoriteCardProps {
  city: City
  variant?: 'desktop' | 'mobile'
}

export function FavoriteCard({ city, variant = 'desktop' }: FavoriteCardProps) {
  const navigate = useNavigate()
  const { unit } = useUnit()
  const { removeFavorite } = useFavorites()
  const forecast = useForecast({ latitude: city.latitude, longitude: city.longitude })

  const today = forecast.data ? getDailyEntries(forecast.data).find((e) => e.isToday) : null
  const info = forecast.data ? getWeatherInfo(forecast.data.current.weatherCode) : null
  const loading = forecast.isLoading || !forecast.data || !info || !today

  function open() {
    navigate('/', { state: { city } })
  }

  if (variant === 'mobile') {
    return (
      <MobileCard
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            open()
          }
        }}
        aria-label={`Open forecast for ${city.name}`}
      >
        <MobileLeft>
          <Flag aria-hidden>{flagEmoji(city.countryCode)}</Flag>
          <MobileLocationText>
            <CityName>{city.name}</CityName>
            <Country>
              <MapPin size={11} aria-hidden />
              {city.country || 'Unknown'}
            </Country>
          </MobileLocationText>
        </MobileLeft>

        <MobileRight>
          <MobileWeatherGroup>
            {loading ? (
              <>
                <Skeleton width="1.375rem" height="1.375rem" radius="9999px" />
                <Skeleton width="2.5rem" height="1rem" />
              </>
            ) : (
              <>
                <ConditionIcon name={info.icon} size={20} />
                <MobileCurrent>{formatTemp(forecast.data.current.temperature, unit)}</MobileCurrent>
              </>
            )}
          </MobileWeatherGroup>

          <MobileRemove
            type="button"
            aria-label={`Remove ${city.name} from favorites`}
            onClick={(e) => {
              e.stopPropagation()
              removeFavorite(cityKey(city))
            }}
          >
            <Trash2 size={18} aria-hidden />
          </MobileRemove>
        </MobileRight>
      </MobileCard>
    )
  }

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      aria-label={`Open forecast for ${city.name}`}
    >
      <LocationCell>
        <Flag aria-hidden>{flagEmoji(city.countryCode)}</Flag>
        <LocationText>
          <CityName>{city.name}</CityName>
          <Country>
            <MapPin size={11} aria-hidden />
            {city.country || 'Unknown'}
          </Country>
        </LocationText>
      </LocationCell>

      <ConditionCell>
        {loading ? (
          <ConditionSkeleton>
            <Skeleton width="1.5rem" height="1.5rem" radius="9999px" />
            <Skeleton width="5rem" height="0.75rem" />
          </ConditionSkeleton>
        ) : (
          <Condition>
            <ConditionIcon name={info.icon} size={22} />
            <ConditionLabel>{info.label}</ConditionLabel>
          </Condition>
        )}
      </ConditionCell>

      <TempCell>
        {forecast.data ? (
          formatTemp(forecast.data.current.temperature, unit)
        ) : (
          <Skeleton width="2.5rem" height="1.25rem" />
        )}
      </TempCell>

      <MinMaxCell>
        {today ? (
          `${formatTemp(today.min, unit)} / ${formatTemp(today.max, unit)}`
        ) : (
          <Skeleton width="5.5rem" height="0.9rem" />
        )}
      </MinMaxCell>

      <ActionCell>
        <Remove
          type="button"
          aria-label={`Remove ${city.name} from favorites`}
          onClick={(e) => {
            e.stopPropagation()
            removeFavorite(cityKey(city))
          }}
        >
          <Trash2 size={16} aria-hidden />
        </Remove>
      </ActionCell>
    </tr>
  )
}

const LocationCell = styled.td`
  padding: 0.875rem 1.125rem;
  white-space: nowrap;
`

const Flag = styled.span`
  display: inline-block;
  font-size: 1.25rem;
  margin-right: 0.625rem;
  vertical-align: middle;
`

const LocationText = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 0.125rem;
  vertical-align: middle;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: baseline;
    gap: 0.5rem;
  }
`

const MobileLocationText = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`

const CityName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
`

const Country = styled.span`
  display: flex;
  align-items: center;
  gap: 0.1875rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.mutedForeground};

  @media (min-width: 768px) {
    white-space: nowrap;
  }
`

const ConditionCell = styled.td`
  padding: 0.875rem 1.125rem;
  white-space: nowrap;
`

const Condition = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ConditionIcon = styled(WeatherIcon)`
  color: ${({ theme }) => theme.color.foreground};
  flex-shrink: 0;
`

const ConditionLabel = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const ConditionSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MobileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 0.9375rem 0;
  background: transparent;
  border: 0;
  border-top: 1px solid oklch(1 0 0 / 0.08);
  touch-action: manipulation;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
  }
`

const MobileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
`

const MobileRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
`

const MobileWeatherGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MobileCurrent = styled.span`
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`

const TempCell = styled.td`
  padding: 0.875rem 1.125rem;
  font-size: 1.125rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
`

const MinMaxCell = styled.td`
  padding: 0.875rem 1.125rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
`

const ActionCell = styled.td`
  padding: 0.875rem 1.125rem;
  text-align: center;
`

const Remove = styled.button`
  display: inline-grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.mutedForeground};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.destructive};
    background: color-mix(in oklab, ${({ theme }) => theme.color.destructive} 12%, transparent);
  }
`

const MobileRemove = styled(Remove)`
  width: 2.75rem;
  height: 2.75rem;
`
