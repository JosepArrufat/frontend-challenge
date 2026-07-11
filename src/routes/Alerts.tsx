import { Bell } from 'lucide-react'
import styled from 'styled-components'
import { MobileTopBar } from '../components/layout/MobileTopBar'

export function Alerts() {
  return (
    <Page>
      <MobileTopBar center={<MobileTitle>Alerts</MobileTitle>} />
      <Content>
        <Mark>
          <Bell size={28} />
        </Mark>
        <Title>Weather alerts</Title>
        <Subtitle>
          There are no active alerts right now. Severe-weather alerts will appear here when issued.
        </Subtitle>
      </Content>
    </Page>
  )
}

const MobileTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
`

const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.25rem;
  flex: 1;
  padding: 1.5rem 1rem 4rem;
`

const Title = styled.h1`
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
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

const Subtitle = styled.p`
  max-width: 24rem;
  color: ${({ theme }) => theme.color.mutedForeground};
  font-size: 0.9375rem;
`
