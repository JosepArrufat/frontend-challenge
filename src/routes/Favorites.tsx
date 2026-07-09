import { Star } from 'lucide-react'
import styled from 'styled-components'

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
  color: ${({ theme }) => theme.color.signature};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow:
    ${({ theme }) => theme.glow.signature},
    inset 0 1px 0 oklch(1 0 0 / 0.12);
`

const Title = styled.h1`
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
`

const Subtitle = styled.p`
  max-width: 24rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  font-size: 0.9375rem;
`

export function Favorites() {
  return (
    <Page>
      <Mark>
        <Star size={28} />
      </Mark>
      <Title>No favorite cities yet</Title>
      <Subtitle>
        Save cities from the forecast view and they will appear here for quick access.
      </Subtitle>
    </Page>
  )
}
