import { Globe } from 'lucide-react'
import styled from 'styled-components'

export function WorldMap() {
  return (
    <Page>
      <Mark>
        <Globe size={28} />
      </Mark>
      <Title>World map</Title>
      <Subtitle>
        The interactive world map isn't built yet. It will let you pick a city by clicking the map.
      </Subtitle>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.25rem;
  padding: 6rem 1.5rem 4rem;
`

const Mark = styled.div`
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
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`

const Subtitle = styled.p`
  max-width: 24rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  font-size: 0.9375rem;
`
