import { useEffect, useId, useRef, useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import { useDebounce } from '../../hooks/useDebounce'
import { useGeocodingSearch } from '../../hooks/useGeocodingSearch'
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../../constants'
import type { City } from '../../types'
import { Spinner } from '../ui/Spinner'
import { ErrorMessage } from '../ui/ErrorMessage'
import { EmptyState } from '../ui/EmptyState'
import { SearchSuggestions } from './SearchSuggestions'

const shimmer = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
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
  color: ${({ theme }) => theme.color.mutedForeground};
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
    color: ${({ theme }) => theme.color.mutedForeground};
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
  color: ${({ theme }) => theme.color.mutedForeground};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.foreground};
    background: ${({ theme }) => theme.color.accent};
  }
`

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  z-index: 50;
  overflow: hidden;
  background: color-mix(
    in oklab,
    ${({ theme }) => theme.color.popover} 78%,
    ${({ theme }) => theme.color.background}
  );
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.popover};
  animation: enter 0.14s ease-out;

  @keyframes enter {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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
  color: ${({ theme }) => theme.color.mutedForeground};
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

export interface SearchProps {
  onSelect: (city: City) => void
}

export function Search({ onSelect }: SearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)
  const result = useGeocodingSearch(debouncedQuery)
  const cities = result.data ?? []

  const reactId = useId()
  const listboxId = `${reactId}-listbox`
  const optionId = (index: number) => `${reactId}-opt-${index}`

  const queryValid = debouncedQuery.trim().length >= MIN_SEARCH_LENGTH
  const canShow = open && queryValid

  const safeActiveIndex: number | null =
    activeIndex === null || cities.length === 0
      ? null
      : activeIndex < cities.length
        ? activeIndex
        : 0

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  function selectCity(city: City) {
    onSelect(city)
    setQuery('')
    setActiveIndex(null)
    setOpen(false)
    inputRef.current?.focus()
  }

  function clear() {
    setQuery('')
    setActiveIndex(null)
    setOpen(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      if (!cities.length) return
      e.preventDefault()
      setOpen(true)
      const base = safeActiveIndex === null ? -1 : safeActiveIndex
      setActiveIndex(Math.min(base + 1, cities.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      if (!cities.length) return
      e.preventDefault()
      setOpen(true)
      const base = safeActiveIndex === null ? cities.length : safeActiveIndex
      setActiveIndex(Math.max(base - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      if (canShow && cities.length > 0) {
        e.preventDefault()
        selectCity(cities[safeActiveIndex ?? 0])
      }
      return
    }
    if (e.key === 'Escape') {
      if (canShow) {
        e.preventDefault()
        setOpen(false)
        setActiveIndex(null)
      }
      return
    }
  }

  const status = result.isLoading
    ? 'Searching…'
    : result.isError
      ? 'Search failed'
      : result.isSuccess && cities.length === 0
        ? 'No cities found'
        : result.isSuccess
          ? `${cities.length} ${cities.length === 1 ? 'city' : 'cities'} found`
          : ''

  return (
    <Field ref={containerRef}>
      <VisuallyHidden as="label" htmlFor={`${reactId}-input`}>
        Search for a city
      </VisuallyHidden>
      <InputWrap>
        <SearchGlyph size={18} aria-hidden />
        <Input
          id={`${reactId}-input`}
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={canShow}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            canShow && safeActiveIndex !== null ? optionId(safeActiveIndex) : undefined
          }
          placeholder="Search a city…"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(null)
            setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (queryValid) setOpen(true)
          }}
        />
        {query.length > 0 && (
          <ClearButton type="button" aria-label="Clear search" onClick={clear}>
            <X size={16} aria-hidden />
          </ClearButton>
        )}
      </InputWrap>

      <VisuallyHidden aria-live="polite" role="status">
        {status}
      </VisuallyHidden>

      {canShow && (
        <Popover>
          {result.isLoading && <LoadingBar aria-hidden />}
          {result.isError ? (
            <div style={{ padding: '0.75rem' }}>
              <ErrorMessage
                message="Could not load cities. Check your connection and try again."
                onRetry={() => result.refetch()}
              />
            </div>
          ) : result.isLoading && cities.length === 0 ? (
            <CenterStatus>
              <Spinner label="Searching for cities" />
              Searching…
            </CenterStatus>
          ) : result.isSuccess && cities.length === 0 ? (
            <EmptyState
              icon={<SearchIcon size={20} />}
              title={`No cities found for “${debouncedQuery.trim()}”`}
              description="Check the spelling or try a different city name."
            />
          ) : cities.length > 0 ? (
            <SearchSuggestions
              cities={cities}
              query={debouncedQuery.trim()}
              activeIndex={safeActiveIndex}
              listboxId={listboxId}
              optionId={optionId}
              onSelect={selectCity}
              onHover={setActiveIndex}
            />
          ) : null}
        </Popover>
      )}
    </Field>
  )
}
