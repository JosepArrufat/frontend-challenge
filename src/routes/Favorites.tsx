import { useState } from 'react'
import { Star, Plus, X } from 'lucide-react'
import styled from 'styled-components'
import { useFavorites } from '../hooks/useFavorites'
import { useUser } from '../hooks/useUser'
import { cityKey } from '../lib/city'
import { FavoriteCard } from '../components/favorites/FavoriteCard'
import { MobileTopBar } from '../components/layout/MobileTopBar'
import { Search } from '../components/search/Search'

export function Favorites() {
  const { favorites, addFavorite } = useFavorites()
  const { username } = useUser()
  const [showSearch, setShowSearch] = useState(false)

  function handleAdd(city: Parameters<typeof addFavorite>[0]) {
    addFavorite(city)
  }

  return (
    <Page>
      <MobileTopBar
        center={<MobileTitle>{username}'s favorites</MobileTitle>}
        right={
          <AddToggle
            $open={showSearch}
            onClick={() => setShowSearch((v) => !v)}
            aria-label={showSearch ? 'Close add city search' : 'Add a city to favorites'}
            aria-expanded={showSearch}
          >
            {showSearch ? <X size={20} /> : <Plus size={20} />}
          </AddToggle>
        }
      />
      <Body>
        <Header>
          <HeaderLeft>
            <Title>{username}'s favorites</Title>
            <Count>
              {favorites.length} {favorites.length === 1 ? 'city' : 'cities'}
            </Count>
          </HeaderLeft>
          <DesktopToggle
            $open={showSearch}
            onClick={() => setShowSearch((v) => !v)}
            aria-label={showSearch ? 'Close add city search' : 'Add a city to favorites'}
            aria-expanded={showSearch}
          >
            {showSearch ? <X size={18} /> : <Plus size={18} />}
            {showSearch ? 'Close' : 'Add city'}
          </DesktopToggle>
        </Header>

        {showSearch && (
          <SearchPanel>
            <Search onSelect={handleAdd} />
          </SearchPanel>
        )}

        {favorites.length === 0 && !showSearch ? (
          <EmptyContent>
            <Mark>
              <Star size={28} />
            </Mark>
            <Title>No favorite cities yet</Title>
            <Subtitle>
              Tap the add button above to search for cities and save them here for quick access.
            </Subtitle>
          </EmptyContent>
        ) : (
          <>
            <MobileList>
              {favorites.map((city) => (
                <FavoriteCard key={cityKey(city)} city={city} variant="mobile" />
              ))}
            </MobileList>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th scope="col" $location>
                      Location
                    </Th>
                    <Th scope="col">Condition</Th>
                    <Th scope="col" $right>
                      Current
                    </Th>
                    <Th scope="col" $right>
                      Min/Max
                    </Th>
                    <Th scope="col" $center>
                      Actions
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {favorites.map((city) => (
                    <FavoriteCard key={cityKey(city)} city={city} />
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </>
        )}
      </Body>
    </Page>
  )
}

const MobileTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AddToggle = styled.button<{ $open: boolean }>`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $open, theme }) => ($open ? theme.color.foreground : theme.color.primary)};
  background: ${({ $open, theme }) =>
    $open
      ? theme.color.secondary
      : 'color-mix(in oklab, ' + theme.color.primary + ' 14%, transparent)'};

  &:active {
    background: ${({ $open, theme }) =>
      $open
        ? theme.color.accent
        : 'color-mix(in oklab, ' + theme.color.primary + ' 24%, transparent)'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
  }
`

const DesktopToggle = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $open, theme }) => ($open ? theme.color.foreground : theme.color.primary)};
  background: ${({ $open, theme }) =>
    $open
      ? theme.color.secondary
      : 'color-mix(in oklab, ' + theme.color.primary + ' 14%, transparent)'};
  border: 1px solid ${({ $open, theme }) => ($open ? theme.color.border : 'transparent')};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ $open, theme }) =>
      $open
        ? theme.color.accent
        : 'color-mix(in oklab, ' + theme.color.primary + ' 22%, transparent)'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
  }
`

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 0 4rem;
  width: 100%;

  @media (min-width: 1024px) {
    padding: 2.5rem 2rem 4rem;
  }
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem 0;

  @media (min-width: 1024px) {
    padding: 0;
  }
`

const SearchPanel = styled.div`
  width: 100%;
  max-width: 30rem;

  @media (min-width: 1024px) {
    max-width: 28rem;
  }
`

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.25rem;
  flex: 1;
`

const Header = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`

const Title = styled.h1`
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
`

const Count = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

const MobileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: 768px) {
    display: none;
  }
`

const TableWrap = styled.div`
  display: none;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.shadow.card};
  overflow-x: auto;

  @media (min-width: 768px) {
    display: block;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;

  tbody tr {
    cursor: pointer;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    transition: background 0.15s ease;

    &:hover {
      background: ${({ theme }) => theme.color.accent};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.ring};
      outline-offset: -2px;
    }
  }
`

const Th = styled.th<{ $right?: boolean; $center?: boolean; $location?: boolean }>`
  padding: 0.75rem 1.125rem;
  padding-left: ${({ $location }) => ($location ? '3rem' : '1.125rem')};
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.mutedForeground};
  text-align: ${({ $right, $center }) => ($right ? 'right' : $center ? 'center' : 'left')};
  white-space: nowrap;
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
