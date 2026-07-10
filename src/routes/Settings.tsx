import { Settings as SettingsIcon } from 'lucide-react'
import styled from 'styled-components'
import { useUnit } from '../hooks/useUnit'

export function Settings() {
  const { unit, setUnit } = useUnit()
  return (
    <Page>
      <Mark>
        <SettingsIcon size={28} />
      </Mark>
      <Title>Settings</Title>
      <Subtitle>
        More preferences will appear here. For now you can switch the temperature unit.
      </Subtitle>
      <Row>
        <RowLabel>Temperature unit</RowLabel>
        <ToggleGroup>
          <ToggleBtn
            $active={unit === 'celsius'}
            aria-pressed={unit === 'celsius'}
            onClick={() => setUnit('celsius')}
          >
            °C
          </ToggleBtn>
          <ToggleBtn
            $active={unit === 'fahrenheit'}
            aria-pressed={unit === 'fahrenheit'}
            onClick={() => setUnit('fahrenheit')}
          >
            °F
          </ToggleBtn>
        </ToggleGroup>
      </Row>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 4rem 1.5rem 4rem;
  text-align: center;
`

const Mark = styled.div`
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: ${({ theme }) => theme.radius.xl};
  color: ${({ theme }) => theme.color.mutedForeground};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
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

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
  max-width: 24rem;
  padding: 1rem 1.125rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
`

const RowLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
`

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.muted};
  border: 1px solid ${({ theme }) => theme.color.border};
`

const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? theme.color.primaryForeground : theme.color.mutedForeground)};
  background: ${({ $active, theme }) => ($active ? theme.color.primary : 'transparent')};
`
