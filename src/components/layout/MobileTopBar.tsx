import { Menu } from 'lucide-react'
import styled from 'styled-components'
import { useNav } from '../../hooks/useNav'

export interface MobileTopBarProps {
  center?: React.ReactNode
  right?: React.ReactNode
}

export function MobileTopBar({ center, right }: MobileTopBarProps) {
  const { openNav } = useNav()
  return (
    <Bar>
      <Hamburger type="button" aria-label="Open menu" onClick={openNav}>
        <Menu size={20} />
      </Hamburger>
      {center && <Center>{center}</Center>}
      {right && <Right>{right}</Right>}
    </Bar>
  )
}

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 30;
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: transparent;

  @media (min-width: 1024px) {
    display: none !important;
  }

  @media (max-width: 1023px) {
    display: flex;
  }
`

const Hamburger = styled.button`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.foreground};
  background: transparent;

  &:active {
    background: ${({ theme }) => theme.color.accent};
  }
`

const Center = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Right = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`
