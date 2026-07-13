import { useEffect, useState } from 'react'
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
import { useCurrentCity } from '../hooks/useCurrentCity'
import { useGeolocatedCity } from '../hooks/useGeolocatedCity'
import { useForecast } from '../hooks/useForecast'
import { useUser } from '../hooks/useUser'
import { DEFAULT_USERNAME } from '../context/userContext'
import { getHourlySlice, getDailyEntries, getTodaySunTimes } from '../lib/forecast'
import type { City } from '../types'

interface LocationState {
  city?: City
}

export function Home() {
  const location = useLocation()
  const routeCity = (location.state as LocationState | null)?.city ?? null
  const { username } = useUser()
  const isGuest = username === DEFAULT_USERNAME
  const { currentCity, setCurrentCity } = useCurrentCity()
  const shouldAutoDetectCity = !routeCity && !currentCity
  const { city: detectedCity, status: detectedCityStatus } = useGeolocatedCity(shouldAutoDetectCity)
  const [selectedCity, setSelectedCity] = useState<City | null | undefined>(undefined)
  const city =
    selectedCity === undefined ? (routeCity ?? currentCity ?? detectedCity ?? null) : selectedCity

  useEffect(() => {
    setSelectedCity(undefined)
  }, [username])

  useEffect(() => {
    if (routeCity || currentCity || !detectedCity) return
    setSelectedCity((prev) => (prev === undefined ? detectedCity : prev))
  }, [routeCity, currentCity, detectedCity])

  useEffect(() => {
    if (city && !isGuest) setCurrentCity(city)
  }, [city, setCurrentCity, isGuest])

  const forecast = useForecast(city ? { latitude: city.latitude, longitude: city.longitude } : null)

  return (
    <Page>
      {!city && (
        <>
          <MobileTopBar
            center={
              <MobileSearch>
                <Search onSelect={setSelectedCity} />
              </MobileSearch>
            }
            right={<AuthWidget />}
          />
          <DesktopAuthBar>
            <AuthWidget />
          </DesktopAuthBar>
          <Welcome>
            <HeroMark>
              <CloudSun size={30} />
            </HeroMark>
            <Title>Weather Forecast</Title>
            <Subtitle>
              Search for any city to see its current conditions, hourly outlook, and a 30-day
              forecast.
            </Subtitle>
            {shouldAutoDetectCity && detectedCityStatus !== 'success' && (
              <LocationHint>
                {detectedCityStatus === 'loading'
                  ? 'Detecting your current location…'
                  : 'Location unavailable. Search for a city or set a current city in Settings.'}
              </LocationHint>
            )}
            <SearchSlot>
              <Search onSelect={setSelectedCity} />
            </SearchSlot>
          </Welcome>
        </>
      )}

      {city && (
        <>
          <MobileTopBar
            center={
              <MobileCityInfo
                role="button"
                tabIndex={0}
                aria-label={`Change city from ${city.name}`}
                onClick={() => setSelectedCity(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedCity(null)
                  }
                }}
              >
                <MapPin size={14} aria-hidden />
                <MobileCityName>{city.name}</MobileCityName>
                {city.country && <MobileCityCountry>, {city.country}</MobileCityCountry>}
                <StarSlot onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton city={city} iconOnly />
                </StarSlot>
              </MobileCityInfo>
            }
          />
          <TopBar onSelectCity={setSelectedCity} />
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

const MobileCityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  color: ${({ theme }) => theme.color.foreground};
  background: transparent;
  border: none;
  min-width: 0;
  overflow: hidden;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
  }
`

const MobileCityName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
`

const MobileCityCountry = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.foreground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`

const StarSlot = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`

const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  isolation: isolate;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background-image:
      radial-gradient(circle at top, oklch(0.76 0.06 80 / 0.16), transparent 34%),
      url('${import.meta.env.BASE_URL}islandFallback.jpeg');
    background-image:
      radial-gradient(circle at top, oklch(0.76 0.06 80 / 0.16), transparent 34%),
      image-set(
        url('${import.meta.env.BASE_URL}island2.jpeg') type('image/jpeg') 1x,
        url('${import.meta.env.BASE_URL}islandFallback.jpeg') type('image/jpeg') 1x
      );
    background-position:
      center top,
      center center;
    background-size: auto, cover;
    background-repeat: no-repeat;
    opacity: 0.72;
    transform: scale(1.04);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(180deg, oklch(0.12 0.01 250 / 0.18), oklch(0.1 0.01 250 / 0.36)),
      radial-gradient(circle at top, oklch(0.78 0.08 85 / 0.12), transparent 40%);
  }

  > * {
    position: relative;
  }
`

const DesktopAuthBar = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    justify-content: flex-end;
    padding: 1.25rem 1.5rem 0;
  }
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
  text-shadow:
    0 1px 12px oklch(0 0 0 / 0.55),
    0 2px 32px oklch(0 0 0 / 0.35);
`

const Subtitle = styled.p`
  max-width: 26rem;
  color: ${({ theme }) => theme.color.foreground};
  font-size: 0.9375rem;
  text-shadow: 0 1px 8px oklch(0 0 0 / 0.5);
`

const LocationHint = styled.p`
  max-width: 28rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.foreground};
  opacity: 0.8;
  text-shadow: 0 1px 8px oklch(0 0 0 / 0.5);
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
