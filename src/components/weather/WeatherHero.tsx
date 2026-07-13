import { Wind, Droplets, Gauge, Sun, Eye, Sunrise, Sunset } from 'lucide-react'
import styled from 'styled-components'
import type { City, CurrentWeather } from '../../types'
import { getWeatherInfo } from '../../lib/weatherCodes'
import {
  formatTemp,
  roundTemp,
  formatCurrentTime,
  currentWeekday,
  uvLabel,
  formatVisibility,
  formatTime,
} from '../../lib/format'
import { useUnit } from '../../hooks/useUnit'
import { WeatherIcon } from '../ui/WeatherIcon'
import { Skeleton } from '../ui/Skeleton'
import { FavoriteButton } from '../favorites/FavoriteButton'

export interface WeatherHeroProps {
  city: City
  current: CurrentWeather
  timezone: string
  sunrise: string
  sunset: string
}

export function WeatherHero({ city, current, timezone, sunrise, sunset }: WeatherHeroProps) {
  const { unit } = useUnit()
  const info = getWeatherInfo(current.weatherCode)
  return (
    <Panel>
      <HeaderRow>
        <PlaceInfo>
          <CityName>{city.name}</CityName>
          <DateTime>
            {currentWeekday(timezone)} · {formatCurrentTime(timezone)}
          </DateTime>
        </PlaceInfo>
        <HeaderActions>
          <FavoriteButton city={city} />
          <BigIcon name={info.icon} size={64} />
        </HeaderActions>
      </HeaderRow>

      <TempBlock>
        <Temp>{formatTemp(current.temperature, unit)}</Temp>
        <TempMeta>
          <Condition>{info.label}</Condition>
          <FeelsLike>Feels like {formatTemp(current.apparentTemperature, unit)}</FeelsLike>
        </TempMeta>
      </TempBlock>

      <StatRow>
        <StatTile>
          <StatTop>
            <StatIconWrap>
              <Wind size={16} />
            </StatIconWrap>
            <StatValue>{roundTemp(current.windSpeed)} km/h</StatValue>
          </StatTop>
          <StatLabel>Wind</StatLabel>
        </StatTile>
        <StatTile>
          <StatTop>
            <StatIconWrap>
              <Droplets size={16} />
            </StatIconWrap>
            <StatValue>{roundTemp(current.relativeHumidity)}%</StatValue>
          </StatTop>
          <StatLabel>Humidity</StatLabel>
        </StatTile>
        <StatTile>
          <StatTop>
            <StatIconWrap>
              <Gauge size={16} />
            </StatIconWrap>
            <StatValue>{roundTemp(current.surfacePressure)} hPa</StatValue>
          </StatTop>
          <StatLabel>Pressure</StatLabel>
        </StatTile>
      </StatRow>

      <DetailRow>
        <DetailTile>
          <DetailIconBg>
            <Sun size={18} />
          </DetailIconBg>
          <DetailLabel>UV index</DetailLabel>
          <DetailValue>{roundTemp(current.uvIndex, 1)}</DetailValue>
          <DetailSub>{uvLabel(current.uvIndex)}</DetailSub>
        </DetailTile>
        <DetailTile>
          <DetailIconBg>
            <Eye size={18} />
          </DetailIconBg>
          <DetailLabel>Visibility</DetailLabel>
          <DetailValue>{formatVisibility(current.visibility)}</DetailValue>
        </DetailTile>
        <DetailTile>
          <DetailIconBg>
            <Sunrise size={18} />
          </DetailIconBg>
          <DetailLabel>Sunrise</DetailLabel>
          <DetailValue>{sunrise ? formatTime(sunrise) : '—'}</DetailValue>
        </DetailTile>
        <DetailTile>
          <DetailIconBg>
            <Sunset size={18} />
          </DetailIconBg>
          <DetailLabel>Sunset</DetailLabel>
          <DetailValue>{sunset ? formatTime(sunset) : '—'}</DetailValue>
        </DetailTile>
      </DetailRow>
    </Panel>
  )
}

export interface WeatherHeroSkeletonProps {
  city: City
}

export function WeatherHeroSkeleton({ city }: WeatherHeroSkeletonProps) {
  return (
    <Panel aria-busy="true" aria-label={`Loading weather for ${city.name}`}>
      <HeaderRow>
        <PlaceInfo>
          <CityName>{city.name}</CityName>
          <Skeleton width="10rem" height="0.875rem" />
        </PlaceInfo>
        <Skeleton width="5rem" height="5rem" radius="0" />
      </HeaderRow>
      <TempBlock>
        <Skeleton width="5rem" height="3rem" radius="0" />
        <Skeleton width="8rem" height="0.9rem" />
      </TempBlock>
      <StatRow>
        {[0, 1, 2].map((i) => (
          <StatTile key={i}>
            <StatTop>
              <Skeleton width="1rem" height="1rem" radius="9999px" />
              <Skeleton width="3rem" height="0.9rem" />
            </StatTop>
            <Skeleton width="2.5rem" height="0.625rem" />
          </StatTile>
        ))}
      </StatRow>
      <DetailRow>
        {[0, 1, 2, 3].map((i) => (
          <DetailTile key={i}>
            <Skeleton width="2.5rem" height="2.5rem" radius="0.75rem" />
            <Skeleton width="3rem" height="0.75rem" />
            <Skeleton width="3.5rem" height="0.9rem" />
          </DetailTile>
        ))}
      </DetailRow>
    </Panel>
  )
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem;

  @media (min-width: 1024px) {
    padding: 1.75rem;
  }

  border-radius: 0;
  background: transparent;
  border: none;
  box-shadow: none;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`

const PlaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`

const CityName = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DateTime = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const BigIcon = styled(WeatherIcon)`
  color: ${({ theme }) => theme.color.primary};
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 4px 16px oklch(0.62 0.2 256 / 0.4));

  @media (min-width: 1024px) {
    width: 80px;
    height: 80px;
  }
`

const TempBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const Temp = styled.span`
  font-size: clamp(2.5rem, 10vw, 3.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
`

const TempMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

const FeelsLike = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const Condition = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.color.foreground};
`

const StatRow = styled.div`
  display: flex;
  align-items: stretch;
`

const StatTile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
  padding: 0 0.875rem;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  &:not(:first-child) {
    border-left: 1px solid ${({ theme }) => theme.color.border};
  }
`

const StatTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

const StatIconWrap = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.color.primary};
`

const StatLabel = styled.span`
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const StatValue = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const DetailTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.875rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.muted};
  border: 1px solid ${({ theme }) => theme.color.border};
`

const DetailIconBg = styled.span`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.primary};
  background: color-mix(
    in oklab,
    ${({ theme }) => theme.color.background} 60%,
    ${({ theme }) => theme.color.primary} 12%
  );
`

const DetailLabel = styled.span`
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.mutedForeground};
  text-align: center;
`

const DetailValue = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const DetailSub = styled.span`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`
