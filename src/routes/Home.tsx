import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CloudSun, MapPin } from 'lucide-react'
import styled from 'styled-components'
import { TopBar } from '../components/layout/TopBar'
import { MobileTopBar } from '../components/layout/MobileTopBar'
import { AuthWidget } from '../components/layout/AuthWidget'
import { Search } from '../components/search/Search'
import { WeatherHero, WeatherHeroSkeleton } from '../components/weather/WeatherHero'
import { HourlyForecast, HourlyForecastSkeleton } from '../components/weather/HourlyForecast'
import { DailyForecast, DailyForecastSkeleton } from '../components/weather/DailyForecast'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { FavoriteButton } from '../components/favorites/FavoriteButton'
import { useForecast } from '../hooks/useForecast'
import { getHourlySlice, getDailyEntries, getTodaySunTimes } from '../lib/forecast'
import type { City } from '../types'

interface LocationState {
  city?: City
}

export function Home() {
  const location = useLocation()
  const [city, setCity] = useState<City | null>(
    () => (location.state as LocationState)?.city ?? null,
  )
  const forecast = useForecast(city ? { latitude: city.latitude, longitude: city.longitude } : null)

  return (
    <Page>
      {!city && (
        <>
          <MobileTopBar
            center={
              <MobileSearch>
                <Search onSelect={setCity} />
              </MobileSearch>
            }
            right={<AuthWidget />}
          />
          <Welcome>
            <HeroMark>
              <CloudSun size={30} />
            </HeroMark>
            <Title>Weather Forecast</Title>
            <Subtitle>
              Search for any city to see its current conditions, hourly outlook, and a 30-day
              forecast.
            </Subtitle>
            <SearchSlot>
              <Search onSelect={setCity} />
            </SearchSlot>
          </Welcome>
        </>
      )}

      {city && (
        <>
          <MobileTopBar
            center={
              <MobileCityInfo onClick={() => setCity(null)}>
                <MapPin size={14} />
                <MobileCityName>{city.name}</MobileCityName>
                {city.country && <MobileCityCountry>, {city.country}</MobileCityCountry>}
              </MobileCityInfo>
            }
            right={<FavoriteButton city={city} />}
          />
          <TopBar onSelectCity={setCity} />
          <Content>
            {forecast.isError ? (
              <ErrorSlot>
                <ErrorMessage
                  message="Could not load the forecast for this city. Check your connection and try again."
                  onRetry={() => forecast.refetch()}
                />
              </ErrorSlot>
            ) : forecast.isLoading || !forecast.data ? (
              <>
                <LeftCol>
                  <WeatherHeroSkeleton city={city} />
                </LeftCol>
                <RightCol>
                  <HourlyForecastSkeleton />
                  <DailyForecastSkeleton />
                </RightCol>
              </>
            ) : (
              <>
                <LeftCol>
                  <WeatherHero
                    city={city}
                    current={forecast.data.current}
                    timezone={forecast.data.timezone}
                    sunrise={getTodaySunTimes(forecast.data).sunrise}
                    sunset={getTodaySunTimes(forecast.data).sunset}
                  />
                </LeftCol>
                <RightCol>
                  <HourlyForecast entries={getHourlySlice(forecast.data)} />
                  <DailyForecast key={city.id} entries={getDailyEntries(forecast.data)} />
                </RightCol>
              </>
            )}
          </Content>
        </>
      )}
    </Page>
  )
}

const MobileSearch = styled.div`
  flex: 1;
  min-width: 0;
`

const MobileCityInfo = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  color: ${({ theme }) => theme.color.foreground};
  background: transparent;
  border: none;
  min-width: 0;
  overflow: hidden;
`

const MobileCityName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
`

const MobileCityCountry = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  padding: 4rem 1rem 4rem;

  @media (min-width: 1024px) {
    padding: 4rem 1.5rem 4rem;
  }
`

const HeroMark = styled.div`
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: ${({ theme }) => theme.radius.xl};
  color: ${({ theme }) => theme.color.primary};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow:
    ${({ theme }) => theme.glow.primary},
    inset 0 1px 0 oklch(1 0 0 / 0.12);
`

const Title = styled.h1`
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
`

const Subtitle = styled.p`
  max-width: 26rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  font-size: 0.9375rem;
`

const SearchSlot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 30rem;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 1.25rem;
    padding: 1.5rem;
    align-items: flex-start;
  }
`

const LeftCol = styled.div`
  flex: 1.2;
  min-width: 0;
`

const RightCol = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ErrorSlot = styled.div`
  width: 100%;
  max-width: 30rem;
  margin: 2rem auto;
`
