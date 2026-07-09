import { useState } from 'react'
import { CloudSun, MapPin, X } from 'lucide-react'
import styled from 'styled-components'
import { Search } from '../components/search/Search'
import type { City } from '../types'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 4.5rem 1.5rem 4rem;
`

const HeroStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
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
`

const SelectedCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  max-width: 30rem;
  padding: 1rem 1.125rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.card};
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.shadow.card};
`

const PinWrap = styled.div`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.primary};
  background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 16%, transparent);
`

const SelectedInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const SelectedName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.foreground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SelectedMeta = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const Deselect = styled.button`
  margin-left: auto;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.mutedForeground};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }
`

export function Home() {
  const [city, setCity] = useState<City | null>(null)

  return (
    <Page>
      <HeroStack>
        <HeroMark>
          <CloudSun size={30} />
        </HeroMark>
        <Title>Weather Forecast</Title>
        <Subtitle>
          Search for any city to see its current conditions, hourly outlook, and a 30-day forecast.
        </Subtitle>
      </HeroStack>

      <SearchSlot>
        <Search onSelect={setCity} />
      </SearchSlot>

      {city && (
        <SelectedCard>
          <PinWrap>
            <MapPin size={18} />
          </PinWrap>
          <SelectedInfo>
            <SelectedName>{city.name}</SelectedName>
            <SelectedMeta>{city.country || 'Selected city'}</SelectedMeta>
          </SelectedInfo>
          <Deselect
            type="button"
            aria-label={`Clear ${city.name} selection`}
            onClick={() => setCity(null)}
          >
            <X size={16} />
          </Deselect>
        </SelectedCard>
      )}
    </Page>
  )
}
