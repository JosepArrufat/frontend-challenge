import { useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { useCombobox } from 'downshift'
import styled, { css, keyframes } from 'styled-components'
import { useDebounce } from '../../hooks/useDebounce'
import { useGeocodingSearch } from '../../hooks/useGeocodingSearch'
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../../constants'
import type { City } from '../../types'
import { Spinner } from '../ui/Spinner'
import { ErrorMessage } from '../ui/ErrorMessage'
import { EmptyState } from '../ui/EmptyState'
import { flagEmoji } from '../../lib/flag'

const shimmer = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`

const enter = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`

const Field = styled.div`
  position: relative;
  width: 100%;
  max-width: 30rem;
`

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const SearchGlyph = styled(SearchIcon)`
  position: absolute;
  left: 0.875rem;
  color: ${({ theme }) => theme.color.foreground};
  pointer-events: none;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.color.foreground};
  background: ${({ theme }) => theme.color.card};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.color.foreground};
  }

  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    display: none;
  }

  &::-ms-clear,
  &::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }

  &:hover {
    border-color: color-mix(
      in oklab,
      ${({ theme }) => theme.color.border} 60%,
      ${({ theme }) => theme.color.foreground} 10%
    );
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: 0 0 0 3px
      color-mix(in oklab, ${({ theme }) => theme.color.primary} 35%, transparent);
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.foreground};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }
`

const MenuWrap = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  z-index: 50;
  overflow: hidden;
  background: ${({ theme }) => theme.color.background};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.popover};
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  ${({ $open }) =>
    $open &&
    css`
      animation: ${enter} 0.14s ease-out;
    `}
`

const LoadingBar = styled.div`
  position: relative;
  height: 2px;
  overflow: hidden;
  background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 18%, transparent);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.color.primary},
      transparent
    );
    animation: ${shimmer} 1.1s ease-in-out infinite;
  }
`

const CenterStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.foreground};
`

const ErrorWrap = styled.div`
  padding: 0.75rem;
`

const Listbox = styled.ul<{ $hasItems: boolean }>`
  list-style: none;
  margin: 0;
  padding: ${({ $hasItems }) => ($hasItems ? '0.375rem' : '0')};
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
  color: ${({ theme }) => theme.color.foreground};
`

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
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

export interface SearchProps {
  onSelect: (city: City) => void
}

export function Search({ onSelect }: SearchProps) {
  const [inputValue, setInputValue] = useState('')
  const debouncedQuery = useDebounce(inputValue, SEARCH_DEBOUNCE_MS)
  const result = useGeocodingSearch(debouncedQuery)
  const cities = result.data ?? []

  const queryValid = debouncedQuery.trim().length >= MIN_SEARCH_LENGTH

  const {
    isOpen,
    reset,
    getMenuProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    highlightedIndex,
  } = useCombobox<City>({
    items: cities,
    inputValue,
    onInputValueChange: ({ inputValue }) => setInputValue(inputValue),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onSelect(selectedItem)
        reset()
      }
    },
    itemToString: (item) => item?.name ?? '',
    stateReducer: (state, { type, changes }) => {
      if (type === useCombobox.stateChangeTypes.InputBlur) {
        return { isOpen: false, highlightedIndex: -1 }
      }
      if (
        type === useCombobox.stateChangeTypes.InputKeyDownEnter &&
        state.isOpen &&
        cities.length > 0 &&
        state.highlightedIndex < 0
      ) {
        return {
          ...changes,
          selectedItem: cities[0],
          inputValue: '',
          isOpen: false,
          highlightedIndex: -1,
        }
      }
      if (changes.selectedItem) {
        return { ...changes, inputValue: '' }
      }
      return changes
    },
  })

  const canShow = isOpen && queryValid

  const status = result.isLoading
    ? 'Searching…'
    : result.isError
      ? 'Search failed'
      : result.isSuccess && cities.length === 0
        ? 'No cities found'
        : result.isSuccess
          ? `${cities.length} ${cities.length === 1 ? 'city' : 'cities'} found`
          : ''

  const trimmedQuery = debouncedQuery.trim()

  return (
    <Field>
      <VisuallyHidden as="label" {...getLabelProps()}>
        Search for a city
      </VisuallyHidden>
      <InputWrap>
        <SearchGlyph size={18} aria-hidden />
        <Input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search a city…',
            autoComplete: 'off',
          })}
        />
        {inputValue.length > 0 && (
          <ClearButton type="button" aria-label="Clear search" onClick={reset}>
            <X size={16} aria-hidden />
          </ClearButton>
        )}
      </InputWrap>

      <VisuallyHidden aria-live="polite" role="status">
        {status}
      </VisuallyHidden>

      <MenuWrap $open={canShow}>
        {canShow && result.isLoading && <LoadingBar aria-hidden />}
        {canShow && result.isError ? (
          <ErrorWrap>
            <ErrorMessage
              message="Could not load cities. Check your connection and try again."
              onRetry={() => result.refetch()}
            />
          </ErrorWrap>
        ) : canShow && result.isLoading && cities.length === 0 ? (
          <CenterStatus>
            <Spinner label="Searching for cities" />
            Searching…
          </CenterStatus>
        ) : canShow && result.isSuccess && cities.length === 0 ? (
          <EmptyState
            icon={<SearchIcon size={20} />}
            title={`No cities found for “${trimmedQuery}”`}
            description="Check the spelling or try a different city name."
          />
        ) : null}

        <Listbox $hasItems={cities.length > 0} {...getMenuProps()}>
          {cities.map((city, index) => {
            const parts = splitMatch(city.name, trimmedQuery)
            return (
              <Option
                key={city.id}
                $active={highlightedIndex === index}
                {...getItemProps({ item: city, index })}
              >
                <Flag aria-hidden>{flagEmoji(city.countryCode)}</Flag>
                <Name>
                  {parts.map((part, i) =>
                    part.match ? (
                      <mark key={i}>{part.text}</mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    ),
                  )}
                </Name>
                <Country>{city.country}</Country>
              </Option>
            )
          })}
        </Listbox>
      </MenuWrap>
    </Field>
  )
}
