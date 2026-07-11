import { useNavigate } from 'react-router-dom'
import { Star, Plus } from 'lucide-react'
import styled from 'styled-components'
import { useFavorites } from '../hooks/useFavorites'
import { useUser } from '../hooks/useUser'
import { FavoriteCard } from '../components/favorites/FavoriteCard'
import { MobileTopBar } from '../components/layout/MobileTopBar'

export function Favorites() {
  const { favorites } = useFavorites()
  const { username } = useUser()
  const navigate = useNavigate()

  if (favorites.length === 0) {
    return (
      <Page>
        <MobileTopBar
          center={<MobileTitle>{username}'s favorites</MobileTitle>}
          right={
            <AddBtn onClick={() => navigate('/')} aria-label="Add a city to favorites">
              <Plus size={20} />
            </AddBtn>
          }
        />
        <EmptyContent>
          <Mark>
            <Star size={28} />
          </Mark>
          <Title>No favorite cities yet</Title>
          <Subtitle>
            Save cities from the forecast view and they will appear here for quick access.
          </Subtitle>
        </EmptyContent>
      </Page>
    )
  }

  return (
    <Page>
      <MobileTopBar
        center={<MobileTitle>{username}'s favorites</MobileTitle>}
        right={
          <AddBtn onClick={() => navigate('/')} aria-label="Add a city to favorites">
            <Plus size={20} />
          </AddBtn>
        }
      />
      <Body>
        <Header>
          <Title>{username}'s favorites</Title>
          <Count>
            {favorites.length} {favorites.length === 1 ? 'city' : 'cities'}
          </Count>
        </Header>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th scope="col">Location</Th>
                <Th scope="col">Condition</Th>
                <Th scope="col" $right>
                  Current
                </Th>
                <Th scope="col" $right>
                  Min
                </Th>
                <Th scope="col" $right>
                  Max
                </Th>
                <Th scope="col" $center>
                  Actions
                </Th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((city) => (
                <FavoriteCard key={city.id} city={city} />
              ))}
            </tbody>
          </Table>
        </TableWrap>
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

const AddBtn = styled.button`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.primary};
  background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 14%, transparent);

  &:active {
    background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 24%, transparent);
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

  @media (min-width: 1024px) {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }
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

const TableWrap = styled.div`
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.shadow.card};
  overflow-x: auto;
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

const Th = styled.th<{ $right?: boolean; $center?: boolean }>`
  padding: 0.75rem 1.125rem;
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
