import { ChevronLeft, ChevronRight } from 'lucide-react'
import styled from 'styled-components'

export interface ForecastPaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function ForecastPagination({ page, totalPages, onPrev, onNext }: ForecastPaginationProps) {
  if (totalPages <= 1) return null
  const atStart = page <= 1
  const atEnd = page >= totalPages
  return (
    <Nav aria-label="Forecast pagination">
      <PagerBtn type="button" onClick={onPrev} disabled={atStart} aria-label="Previous page">
        <ChevronLeft size={18} />
      </PagerBtn>
      <Indicator aria-live="polite">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </Indicator>
      <PagerBtn type="button" onClick={onNext} disabled={atEnd} aria-label="Next page">
        <ChevronRight size={18} />
      </PagerBtn>
    </Nav>
  )
}

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`

const PagerBtn = styled.button`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.foreground};
  background: ${({ theme }) => theme.color.secondary};
  border: 1px solid ${({ theme }) => theme.color.border};
  transition:
    opacity 0.15s ease,
    background 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.accent};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

const Indicator = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.foreground};
  font-variant-numeric: tabular-nums;

  strong {
    color: ${({ theme }) => theme.color.foreground};
    font-weight: 600;
  }
`
