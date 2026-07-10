import { useState } from 'react'
import { CloudSun } from 'lucide-react'
import styled from 'styled-components'
import { TopBar } from '../components/layout/TopBar'
import { Search } from '../components/search/Search'
import { WeatherHero, WeatherHeroSkeleton } from '../components/weather/WeatherHero'
import { HourlyForecast, HourlyForecastSkeleton } from '../components/weather/HourlyForecast'
import { DailyForecast, DailyForecastSkeleton } from '../components/weather/DailyForecast'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { useForecast } from '../hooks/useForecast'
import { getHourlySlice, getDailyEntries, getTodaySunTimes } from '../lib/forecast'
import type { City } from '../types'

export function Home() {
  const [city, setCity] = useState<City | null>(null)
  const forecast = useForecast(city ? { latitude: city.latitude, longitude: city.longitude } : null)

  return (
    <Page>
      {!city && (
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
      )}

      {city && (
        <>
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
  padding: 4rem 1.5rem 4rem;
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
  gap: 1.25rem;
  padding: 1.5rem;
  align-items: flex-start;
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
