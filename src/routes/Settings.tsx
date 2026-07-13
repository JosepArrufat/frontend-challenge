import { useState } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import styled from 'styled-components'
import { useUnit } from '../hooks/useUnit'
import { useUser } from '../hooks/useUser'
import { useCurrentCity } from '../hooks/useCurrentCity'
import { MobileTopBar } from '../components/layout/MobileTopBar'
import { Search } from '../components/search/Search'

export function Settings() {
  const { unit, setUnit } = useUnit()
  const { username, setUsername } = useUser()
  const { currentCity, setCurrentCity, clearCurrentCity } = useCurrentCity()
  const [nameInput, setNameInput] = useState(username)
  const inputChanged = nameInput.trim() !== username

  return (
    <Page>
      <MobileTopBar center={<MobileTitle>Settings</MobileTitle>} />
      <Content>
        <Mark>
          <SettingsIcon size={28} />
        </Mark>
        <Title>Settings</Title>
        <Subtitle>Set your name, choose a default city, and switch the temperature unit.</Subtitle>
        <StackedRow>
          <RowHeader>
            <RowLabel>Current city</RowLabel>
            <RowMeta>
              {currentCity
                ? `${currentCity.name}${currentCity.country ? `, ${currentCity.country}` : ''}`
                : 'No saved city. Home will fall back to your current location when available.'}
            </RowMeta>
          </RowHeader>
          <SearchWrap>
            <Search onSelect={setCurrentCity} />
          </SearchWrap>
          {currentCity && (
            <InlineAction>
              <GhostBtn type="button" onClick={clearCurrentCity}>
                Clear saved city
              </GhostBtn>
            </InlineAction>
          )}
        </StackedRow>
        <Row>
          <RowLabel>Your name</RowLabel>
          <NameInput
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Guest"
            aria-label="Your name"
            maxLength={24}
          />
          <SaveBtn type="button" disabled={!inputChanged} onClick={() => setUsername(nameInput)}>
            Save
          </SaveBtn>
        </Row>
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
  gap: 0;
  padding: 0;

  @media (min-width: 1024px) {
    align-items: center;
    text-align: center;
    padding: 4rem 1.5rem 4rem;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding: 1.5rem 1rem 0;

  @media (min-width: 1024px) {
    align-items: center;
    text-align: center;
    padding: 0;
  }
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
  font-size: clamp(1.25rem, 4vw, 1.5rem);
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
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.125rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};

  @media (min-width: 1024px) {
    max-width: 24rem;
  }
`

const StackedRow = styled(Row)`
  align-items: stretch;
  justify-content: flex-start;
  flex-direction: column;
`

const RowHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const RowLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
`

const RowMeta = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const SearchWrap = styled.div`
  width: 100%;
`

const InlineAction = styled.div`
  display: flex;
  justify-content: flex-end;
`

const NameInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.4375rem 0.75rem;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.color.foreground};
  background: ${({ theme }) => theme.color.input};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};

  &::placeholder {
    color: ${({ theme }) => theme.color.mutedForeground};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: 0 0 0 3px
      color-mix(in oklab, ${({ theme }) => theme.color.primary} 35%, transparent);
  }
`

const SaveBtn = styled.button`
  padding: 0.4375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.primaryForeground};
  background: ${({ theme }) => theme.color.primary};
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const GhostBtn = styled.button`
  padding: 0.4375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.mutedForeground};
  background: ${({ theme }) => theme.color.secondary};
  border: 1px solid ${({ theme }) => theme.color.border};

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }
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
