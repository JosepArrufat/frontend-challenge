import styled from 'styled-components'
import type { City } from '../../types'
import { flagEmoji } from '../../lib/flag'

const Listbox = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

const Option = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5625rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.color.secondary : 'transparent')};
  box-shadow: ${({ $active, theme }) => ($active ? `inset 0 0 0 1px ${theme.color.border}` : 'none')};
  transition: background 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.color.accent};
  }
`

const Flag = styled.span`
  font-size: 1.125rem;
  line-height: 1;
`

const Name = styled.span`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.color.foreground};

  mark {
    background: transparent;
    color: ${({ theme }) => theme.color.primary};
    font-weight: 600;
  }
`

const Country = styled.span`
  margin-left: auto;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

interface MatchPart {
  text: string
  match: boolean
}

function splitMatch(text: string, query: string): MatchPart[] {
  if (!query) return [{ text, match: false }]
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  const parts: MatchPart[] = []
  let i = 0
  while (i < text.length) {
    const idx = lower.indexOf(q, i)
    if (idx === -1) {
      parts.push({ text: text.slice(i), match: false })
      break
    }
    if (idx > i) parts.push({ text: text.slice(i, idx), match: false })
    parts.push({ text: text.slice(idx, idx + q.length), match: true })
    i = idx + q.length
  }
  return parts
}

export interface SearchSuggestionsProps {
  cities: City[]
  query: string
  activeIndex: number | null
  listboxId: string
  optionId: (index: number) => string
  onSelect: (city: City) => void
  onHover: (index: number) => void
}

export function SearchSuggestions({
  cities,
  query,
  activeIndex,
  listboxId,
  optionId,
  onSelect,
  onHover,
}: SearchSuggestionsProps) {
  return (
    <Listbox id={listboxId} role="listbox">
      {cities.map((city, index) => {
        const parts = splitMatch(city.name, query)
        return (
          <Option
            key={city.id}
            id={optionId(index)}
            role="option"
            aria-selected={activeIndex === index}
            $active={activeIndex === index}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(city)}
            onMouseEnter={() => onHover(index)}
          >
            <Flag aria-hidden>{flagEmoji(city.countryCode)}</Flag>
            <Name>
              {parts.map((part, i) =>
                part.match ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
              )}
            </Name>
            <Country>{city.country}</Country>
          </Option>
        )
      })}
    </Listbox>
  )
}
