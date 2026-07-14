# Architecture & Patterns

Deep-dive into the component patterns, CSS architecture, React Query strategy, and performance practices used in this codebase — with concrete examples, justification, and areas to improve.

---

## Table of Contents

1. [Component Patterns](#1-component-patterns)
2. [Scalability: What's Good and What to Improve](#2-scalability)
3. [Performance Practices](#3-performance-practices)
4. [CSS Architecture with styled-components](#4-css-architecture)
5. [React Query: What We Win vs fetch](#5-react-query)
6. [useReducer Deep-dive](#6-usereducer)
7. [useRef Deep-dive](#7-useref)

---

## 1. Component Patterns

### 1.1 Named function components with explicit Props interfaces

Every component is a named-export function component with a typed `Props` interface. No class components, no `forwardRef`, no `memo` wrappers.

```ts
// src/components/ui/WeatherIcon.tsx:28
export interface WeatherIconProps {
  name: string
  size?: number
  className?: string
}

export function WeatherIcon({ name, size = 24, className }: WeatherIconProps) {
  const Icon = ICONS[name] ?? Cloud
  return <Icon size={size} className={className} aria-hidden />
}
```

**Why named exports over default exports:**

- Enables auto-complete on import (`import { WeatherIcon }`)
- Prevents naming drift — you can't rename at import site
- Better for refactoring (IDE finds all references by symbol name)
- Tree-shaking is identical with modern bundlers

### 1.2 Skeleton components (paired with main component)

Each data-driven component ships a sibling `*Skeleton` in the same file. The skeleton mirrors the real layout with `<Skeleton>` placeholder blocks.

```tsx
// src/components/weather/WeatherHero.tsx:124
export function WeatherHeroSkeleton({ city }: WeatherHeroSkeletonProps) {
  return (
    <Panel aria-busy="true" aria-label={`Loading weather for ${city.name}`}>
      <HeaderRow>
        <PlaceInfo>
          <CityName>{city.name}</CityName>
          <Skeleton width="10rem" height="0.875rem" />
        </PlaceInfo>
        <Skeleton width="5rem" height="5rem" radius="0" />
      </HeaderRow>
    </Panel>
  )
}
```

Consumed in `src/routes/Home.tsx:125`:

```tsx
forecast.isLoading || !forecast.data ? (
  <>
    <LeftCol><WeatherHeroSkeleton city={city} /></LeftCol>
    <RightCol>
      <HourlyForecastSkeleton />
      <DailyForecastSkeleton />
    </RightCol>
  </>
) : ( ... )
```

**Why paired skeletons (not a generic spinner):**

- Prevents CLS (Cumulative Layout Shift) — the skeleton occupies the exact same space as the real content
- Gives the user a sense of structure before data arrives
- `aria-busy` + `aria-label` on the skeleton wrapper communicates loading state to screen readers
- The skeleton primitive itself is `aria-hidden` so it doesn't pollute the a11y tree

### 1.3 Variant pattern (mobile/desktop in one component)

`FavoriteCard` takes `variant?: 'desktop' | 'mobile'` and returns entirely different JSX trees:

```tsx
// src/components/favorites/FavoriteCard.tsx:20
export function FavoriteCard({ city, variant = 'desktop' }: FavoriteCardProps) {
  // ...shared hooks and data fetching...
  if (variant === 'mobile') {
    return <MobileCard>...</MobileCard> // flex-based horizontal card
  }
  return <tr>...</tr> // table row with <td> cells
}
```

Both variants are rendered in `Favorites.tsx:72` — CSS `@media` shows/hides the appropriate one:

```tsx
<MobileList>     {/* display: none @ 768px+ */}
  {favorites.map((city) => <FavoriteCard key={...} city={city} variant="mobile" />)}
</MobileList>
<TableWrap>      {/* display: none < 768px */}
  <Table><tbody>
    {favorites.map((city) => <FavoriteCard key={...} city={city} />)}
  </tbody></Table>
</TableWrap>
```

**Why this approach (dual-render + CSS toggle) instead of a single responsive component:**

- Mobile uses `<div>` with flex; desktop uses `<tr>/<td>` — semantically different HTML elements can't be reconciled with CSS alone
- Both get the right ARIA semantics for their context
- The shared hooks (`useForecast`, `useUnit`, `useFavorites`) run once and both variants benefit

**Variant pattern (FavoriteButton):**

```tsx
// src/components/favorites/FavoriteButton.tsx:13
export function FavoriteButton({ city, iconOnly = false }: FavoriteButtonProps) {
  const { username } = useUser()
  if (username === DEFAULT_USERNAME) return null // early-return guard
  if (iconOnly) return <IconBtn>...</IconBtn> // star-only
  return <Btn>...</Btn> // star + "Saved"/"Save" label
}
```

### 1.4 Provider + Context split (`.ts` for context, `.tsx` for provider)

Context is declared in a `.ts` file (no JSX) and the Provider component in a `.tsx` file:

```
context/
  favoritesContext.ts    → createContext, reducer, types, action union
  FavoritesContext.tsx   → FavoritesProvider component, useReducer, useMemo
```

**Why split:**

- The `.ts` file is pure logic — testable without rendering (the reducer is a pure function)
- The `.tsx` file is the React glue — `useReducer`, `useEffect` for persistence, `useMemo` for value stability
- Importers who only need the type or the hook don't pull in React JSX runtime

### 1.5 key-based remount for state reset

```tsx
// src/ThemedApp.tsx:16
<CurrentCityProvider key={`current-city:${username}`} username={username}>
  <FavoritesProvider key={`favorites:${username}`} username={username}>
```

When the username changes (login/logout), React unmounts and remounts these providers. Their `useState` initializers re-run (loading from the new user's localStorage key), effectively resetting per-user state without manual cleanup effects.

**Why `key` instead of `useEffect` to reset state:**

- `useEffect` resets cause an extra render cycle (state is set after paint)
- `key` remount is atomic — React discards the old subtree and mounts a fresh one in the same commit
- No risk of "flash of stale data" between logout and state clear

### 1.6 Early-return guards

```tsx
// FavoriteButton.tsx:17   — guest guard
if (username === DEFAULT_USERNAME) return null

// HourlyForecast.tsx:15   — empty-data guard
if (entries.length === 0) return null

// ForecastPagination.tsx:12   — trivial-case guard
if (totalPages <= 1) return null
```

These prevent rendering meaningless UI (a favorite button for a guest, an empty forecast strip, a pager with one page) and keep the component's main JSX focused on the happy path.

---

## 2. Scalability

### What's been treated well

**Folder structure by responsibility:**

```
src/
  components/
    ui/        → generic primitives (Skeleton, Spinner, EmptyState, ErrorMessage, WeatherIcon)
    layout/    → app shell (Sidebar, TopBar, BottomNav, MobileTopBar, AuthWidget)
    search/    → domain feature (Search with useCombobox)
    favorites/ → domain feature (FavoriteButton, FavoriteCard)
    weather/   → domain feature (WeatherHero, HourlyForecast, DailyForecast, ForecastPagination)
  routes/      → page-level components (Home, Favorites, Settings, WorldMap, Alerts)
  hooks/       → reusable logic (useForecast, useGeocodingSearch, useFavorites, useDebounce, ...)
  context/     → state containers (context definition + provider component pairs)
  lib/         → pure utilities (api.ts, forecast.ts, weatherCodes.ts, format.ts, city.ts, flag.ts)
  constants/   → app-wide config values + navItems.ts
  types/       → shared TypeScript types
  styles/      → theme.ts, GlobalStyle.ts
```

**Why this works:**

- `ui/` vs `layout/` vs domain `components/` is a clear escalation: generic → structural → domain-specific
- `hooks/` extracts data logic from components, making it reusable and testable
- `lib/` functions are pure (no React, no hooks) — trivially unit-testable
- `constants/` centralizes magic numbers and the shared `NAV_ITEMS` array (used by both Sidebar and BottomNav)

**Shared navigation config:**

```ts
// src/constants/navItems.ts
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', shortLabel: 'Home', icon: Home, end: true },
  { to: '/map', label: 'World Map', shortLabel: 'Map', icon: Globe },
  // ...
]
```

Both `Sidebar` (full labels) and `BottomNav` (short labels) import from this single source — no duplication.

**Context isolation per concern:**
Five separate contexts (Unit, User, Theme, Favorites, CurrentCity) means a unit toggle doesn't re-render the favorites list. Each provider's `value` is `useMemo`-ed so consumers only re-render when their slice of state changes.

### Where to improve

| Area                           | Current                                                                                   | Improvement                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`Home.tsx` size**            | ~150 lines with 3 `useEffect`s, city resolution logic, geolocation, route state           | Extract a `useHomeCity()` hook: takes `routeCity`, `currentCity`, `isGuest` → returns `{ city, setSelectedCity, status }` |
| **Route-level code splitting** | All routes imported eagerly in `App.tsx`                                                  | `React.lazy(() => import('./routes/WorldMap'))` + `<Suspense>` for on-demand loading                                      |
| **Test coverage**              | 34 tests, but only `lib/` utilities and `useDebounce` — no component or integration tests | Add Testing Library tests for: Search combobox interaction, FavoriteButton toggle, Favorites page add/remove flow         |
| **Type-safe API responses**    | `fetchJson<T>` casts with `as T` — no runtime validation                                  | Add Zod schemas for `ForecastResponse` and geocoding response — validate at the boundary, get typed data for free         |
| **Error boundaries**           | None — a render error in any route crashes the whole app                                  | Wrap each `<Route>` in an `<ErrorBoundary>` with a fallback UI                                                            |
| **Accessibility testing**      | Manual, ARIA attributes by hand                                                           | Add `axe-core` in tests: `expect(await axe(container)).toHaveNoViolations()`                                              |
| **Bundle analysis**            | No visibility into what's heavy                                                           | Add `rollup-plugin-visualizer` to `vite.config.ts` and inspect the treemap                                                |
| **Theme scaling**              | Two hardcoded theme objects (`darkTheme`, `lightTheme`)                                   | Define a base theme + semantic overrides; make it data-driven so adding a third theme is trivial                          |

---

## 3. Performance Practices

### What we do well

#### 3.1 React Query caching (staleTime + gcTime)

```ts
// src/hooks/useForecast.ts:6
useQuery({
  queryKey: ['forecast', params?.latitude, params?.longitude],
  staleTime: FORECAST_STALE_TIME, // 10 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes in cache after unmount
  retry: 1,
})
```

- **staleTime 10min**: once fetched, the forecast is served from cache for 10 minutes without refetching — switching between favorites doesn't re-hit the API
- **gcTime 30min**: even after the last component unmounts, the data stays in memory for 30 minutes — navigating away and back is instant
- **retry: 1**: one retry on transient failures; not infinite (avoids hammering a dead API)

#### 3.2 Request cancellation with AbortController

```ts
// src/lib/api.ts:20
export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const { timeoutMs = API_TIMEOUT_MS, signal: externalSignal } = options
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const relayAbort = () => controller.abort()
  externalSignal?.addEventListener('abort', relayAbort)
  try {
    const res = await fetch(url, { signal: controller.signal })
    // ...
  } finally {
    clearTimeout(timer)
    externalSignal?.removeEventListener('abort', relayAbort)
  }
}
```

This is a **two-layer abort**: React Query passes its `signal` (which aborts when the query is unmounted or superseded), and `fetchJson` relays it to its own `AbortController`. Additionally, the 8-second timeout aborts if the server is slow. The `finally` block cleans up the event listener to prevent leaks.

**What we win:** typing fast in the search bar fires many queries, but only the latest one survives — previous in-flight requests are aborted, saving bandwidth and preventing race conditions where an old response overwrites a newer one.

#### 3.3 Input debouncing

```ts
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}
```

Used in `Search.tsx:251` with 300ms delay. Combined with React Query's `placeholderData: (prev) => prev`, this gives smooth incremental search: the old results stay visible while the new query loads, no flicker.

#### 3.4 Context value stabilization (useMemo + useCallback)

```ts
// src/context/FavoritesContext.tsx:27
const value = useMemo<FavoritesContextValue>(
  () => ({
    favorites: state.items,
    addFavorite: (city) => dispatch({ type: 'add', city }),
    removeFavorite: (key) => dispatch({ type: 'remove', key }),
    toggleFavorite: (city) => dispatch({ type: 'toggle', city }),
    isFavorite: (city) => state.items.some((item) => cityKey(item) === cityKey(city)),
  }),
  [state.items], // only re-creates when favorites change
)
```

Without `useMemo`, every provider render would create a new `value` object, causing all consumers to re-render even if nothing changed. The `useCallback` wrappers on setters (in other contexts) ensure the `useMemo` deps are truly stable.

#### 3.5 Skeleton loading (prevent CLS)

Instead of a spinner that collapses the layout, skeletons preserve the exact dimensions of the real content. This avoids layout thrash and keeps the page visually stable during loads.

### Where to improve

| Area                           | Current                                                               | Impact                                                                                                              | Fix                                                                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`React.memo`**               | Not used anywhere                                                     | `FavoriteCard` renders for every favorite when the list changes, even if that specific card's props haven't changed | Wrap `FavoriteCard` in `memo()` — since `city` is stable (same object reference from context) and `variant` is a string literal, memo would skip re-renders |
| **Code splitting**             | All routes eager-loaded                                               | WorldMap (likely heavy with a map library) loads even if the user never visits it                                   | `const WorldMap = lazy(() => import('./routes/WorldMap'))` + `<Suspense fallback={<Spinner />}>`                                                            |
| **`useTransition` for search** | Search results block the main thread                                  | When the dropdown re-renders with 5+ city results, it's synchronous                                                 | Wrap the `onInputValueChange` handler in `startTransition` so typing stays responsive even with heavy dropdown renders                                      |
| **Image optimization**         | `island2.jpeg` loaded via CSS `background-image` on every Home render | Full-resolution image on mobile screens                                                                             | Use `image-set()` (already done) + `srcset` for `<img>` equivalents; consider `AVIF` (already have `beach.avif` in public/ — use it)                        |
| **Font loading**               | System font stack only                                                | Good — no web font loading cost                                                                                     | No change needed                                                                                                                                            |
| **Bundle size**                | 128 kB gzip                                                           | downshift + react-query + styled-components add up                                                                  | Consider `babel-plugin-styled-components` for SSR (not applicable here) or migrating to CSS variables + Tailwind for a smaller runtime                      |
| **Geolocation request**        | `maximumAge: 300000` (5 min)                                          | Good — avoids re-prompting                                                                                          | Could add `watchPosition` for a "live" weather app, but overkill for this scope                                                                             |

---

## 4. CSS Architecture

### 4.1 Setup

**styled-components v6** with a typed theme. The theme is defined in `src/styles/theme.ts` as two objects (`darkTheme`, `lightTheme`) satisfying a `ThemeShape` interface, with module augmentation for type safety:

```ts
// src/styles/theme.ts:125
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeShape {}
}
```

This means every `({ theme }) => theme.color.primary` is type-checked — a typo like `theme.color.primay` is a compile error.

**ThemeProvider** is set up in `ThemedApp.tsx:30`:

```tsx
<ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
  <GlobalStyle />
  ...
</ThemeProvider>
```

**GlobalStyle** (`src/styles/GlobalStyle.ts`) handles resets, scrollbar styling, selection colors, focus-visible outlines, and a `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.2 Token system (oklch)

All colors are defined in `oklch(L C H)` — a perceptually uniform color space:

```ts
// src/styles/theme.ts (excerpt)
background: 'oklch(0.17 0.045 250)',
foreground: 'oklch(0.95 0.01 250)',
primary:    'oklch(0.62 0.2 256)',
border:     'oklch(0.28 0.02 250)',
```

**Why oklch:**

- **Predictable lightness**: `oklch(0.5 …)` looks the same brightness regardless of hue — unlike HSL where `hsl(60 100% 50%)` (yellow) is much brighter than `hsl(240 100% 50%)` (blue)
- **Smooth tints with `color-mix`**: `color-mix(in oklab, var(--primary) 14%, transparent)` produces a consistent translucent tint because oklab (the rectangular form of oklch) mixes perceptually
- **Future-proof**: oklch is the CSS standard for wide-gamut color — it can express P3 colors that sRGB hex cannot

**Usage in components:**

```tsx
// Translucent primary tint
background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 14%, transparent);

// Two-color mix (background + primary)
background: color-mix(in oklab, ${({ theme }) => theme.color.background} 60%, ${({ theme }) => theme.color.primary} 12%);
```

### 4.3 Transient props (`$` prefix)

styled-components v6 transient props prevent style-only props from leaking to the DOM:

```tsx
// ✅ Good: $active is transient — not rendered as an HTML attribute
const ToggleBtn = styled.button<{ $active: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.color.primaryForeground : theme.color.mutedForeground)};
  background: ${({ $active, theme }) => ($active ? theme.color.primary : 'transparent')};
`

// ❌ Bad without $: React would render <button active="true"> — invalid HTML + console warning
```

Used extensively: `$open`, `$active`, `$hasItems`, `$now`, `$today`, `$left`, `$width`, `$right`, `$center`, `$location`, `$hasClear`.

### 4.4 keyframes + css helper

```tsx
// src/components/search/Search.tsx:14
const enter = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`

const MenuWrap = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  ${({ $open }) =>
    $open &&
    css`
      animation: ${enter} 0.14s ease-out;
    `}
`
```

**Why `css` helper (not template string interpolation):** interpolating a keyframe directly into a template string (`animation: ${enter} …`) stringifies the keyframe to its hash name, losing the injection — styled-components throws an error. The `css` helper preserves the keyframe reference and injects it correctly.

### 4.5 Component extension and wrapping

**Extending a styled component:**

```tsx
// src/routes/Settings.tsx:145
const StackedRow = styled(Row)`
  align-items: stretch;
  flex-direction: column;
`
```

**Wrapping third-party components:**

```tsx
// src/components/layout/Sidebar.tsx:232
const StyledLink = styled(NavLink)<{ $open: boolean }>`
  display: flex;
  align-items: center;
  // ...
`

// src/components/layout/TopBar.tsx:22 — polymorphic `as` prop
<IconButton as={Link} to="/settings" aria-label="Settings">
  <Settings size={18} />
</IconButton>
```

**Wrapping Lucide icons:**

```tsx
const SearchGlyph = styled(SearchIcon)`
  position: absolute;
  left: 0.875rem;
  color: ${({ theme }) => theme.color.foreground};
  pointer-events: none;
`
```

### 4.6 Layout patterns used

#### Flexbox (dominant)

```tsx
// App shell — row
const Shell = styled.div`
  display: flex;
  min-height: 100vh;
`

// Responsive column→row
const Content = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

// Flex-ratio columns
const LeftCol = styled.div`
  flex: 1.2;
  min-width: 0;
`
const RightCol = styled.div`
  flex: 1;
  min-width: 0;
`
```

`min-width: 0` is critical in flex children — without it, long content (city names, weather labels) can overflow the flex item instead of truncating.

#### CSS Grid

```tsx
// Responsive 2→4 column grid for weather details
const DetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

// Centered icon badge (grid as single-cell centering)
const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
`
```

`place-items: center` is the most concise way to center a single child in a fixed-size box — no need for `display: flex; align-items: center; justify-content: center`.

#### Table (semantic tabular data)

```tsx
// src/routes/Favorites.tsx:269
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  tbody tr {
    cursor: pointer;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    &:hover {
      background: ${({ theme }) => theme.color.accent};
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.ring};
    }
  }
`
```

**Why a real `<table>` (not CSS grid):** favorites are tabular data (location, condition, temperature, min/max, actions). A `<table>` gives free semantics — screen readers announce column headers, `scope="col"` is meaningful, and `overflow-x: auto` on the wrapper handles narrow screens.

#### Positional patterns

| Pattern              | Where                                                                                                         | Why                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `position: fixed`    | `BottomNav` (bottom bar), `Sidebar` on mobile (off-canvas drawer), `Backdrop` (overlay)                       | Elements that stay anchored to the viewport regardless of scroll                                    |
| `position: sticky`   | `TopBar`, `MobileTopBar` (sticky header), `Sidebar` on desktop (sticky sidebar)                               | Elements that scroll with content until they hit the viewport edge, then stick                      |
| `position: absolute` | `Search` glyph/clear button/menu (positioned relative to `InputWrap`), `Home` hero background pseudo-elements | Elements positioned relative to a `position: relative` ancestor                                     |
| `isolation: isolate` | `Home` page container                                                                                         | Creates a new stacking context so `z-index: -2` / `-1` pseudo-elements don't escape behind the body |
| `z-index` layering   | `Backdrop: 45`, `Sidebar: 50`, `TopBar: 30`, `BottomNav: 40`, `MenuWrap: 50`                                  | Explicit stacking order — sidebar and search menu sit above backdrop, which sits above content      |

### 4.7 Responsive strategy

Two breakpoints dominate:

- **768px** (md): mobile ↔ tablet/desktop split (e.g., FavoriteCard mobile list ↔ table)
- **1024px** (lg): mobile overlay sidebar ↔ desktop persistent sidebar; `BottomNav` ↔ `Sidebar`

Pattern: **dual-render + CSS toggle** for structurally different layouts (different HTML elements), **single component + media query** for style-only changes (column count, padding, font size).

```tsx
// Single component, media query adjusts
const DetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`
```

---

## 5. React Query

### 5.1 What we win vs raw fetch

| Concern                    | Raw `fetch`                                              | React Query                                                          |
| -------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| **Caching**                | Manual — implement your own cache, TTL, invalidation     | Automatic — `queryKey` + `staleTime` + `gcTime`                      |
| **Request dedup**          | Manual — track in-flight promises                        | Automatic — same `queryKey` concurrent calls share one request       |
| **Loading/error states**   | Manual `useState` for `isLoading`, `isError`, `data`     | Built-in — `result.isLoading`, `result.isError`, `result.data`       |
| **Cancellation**           | Manual `AbortController` wiring                          | Built-in — passes `signal` to `queryFn`, aborts on unmount/supersede |
| **Retry logic**            | Manual — wrap in try/catch loop                          | `retry: 1` (or `retry: false`) — declarative                         |
| **Background refetch**     | Manual — `setInterval` + cleanup                         | `refetchOnWindowFocus`, `refetchInterval` — declarative              |
| **Stale-while-revalidate** | Manual — serve cached + refetch in background            | `staleTime` + `placeholderData: (prev) => prev`                      |
| **Race conditions**        | Manual — track latest request ID, ignore stale responses | Automatic — last `queryKey` wins, previous aborted                   |

### 5.2 Practical exercise: the search flow

**Scenario:** User types "Bar" in the search bar. Here's what happens at each step:

```
1. User types "B"
   → useState: inputValue = "B"
   → useDebounce starts 300ms timer (not yet fired)
   → useGeocodingSearch receives "" (previous debounced value)
   → useQuery: queryKey = ['geocoding', ''], enabled = false (len < 2)
   → No API call

2. User types "a" (inputValue = "Ba")
   → useDebounce resets timer

3. User types "r" (inputValue = "Bar")
   → useDebounce resets timer

4. 300ms passes with no typing
   → useDebounce fires: debouncedQuery = "Bar"
   → useGeocodingSearch("Bar")
   → useQuery: queryKey = ['geocoding', 'Bar'], enabled = true
   → React Query checks cache: miss
   → queryFn({ signal }) → searchCities("Bar", signal) → fetchJson(url, { signal })
   → fetch() starts

5. 'Bar' response arrives (200ms later)
   → result.data = [Barcelona, Bariloche, ...]
   → Dropdown renders results
   → React Query caches ['geocoding', 'Bar'] for 5 minutes (staleTime)
   → The 'Bar' query is now RESOLVED — its data lives in React Query's observer state

6. User types "ce" (inputValue = "Barce")
   → 300ms timer starts

7. 300ms passes
   → debouncedQuery = "Barce"
   → useQuery: queryKey = ['geocoding', 'Barce']
   → React Query: different key → new query
   → The 'Bar' query is RESOLVED (not in-flight) → no abort needed for 'Bar'
   → 'Barce' fetch starts
   → placeholderData: (prev) => prev shows the RESOLVED 'Bar' data while 'Barce' loads
   → Dropdown still shows Barcelona etc. — no flicker, no blank gap

8. 'Barce' response arrives
   → result.data = [Barcelona, ...]
   → Dropdown updates with new results
   → React Query caches ['geocoding', 'Barce'] for 5 minutes

9. User types "Bar" again (backspace)
   → 300ms → debouncedQuery = "Bar"
   → useQuery: queryKey = ['geocoding', 'Bar']
   → React Query: cache HIT (still within 5min staleTime)
   → No API call — serves from cache instantly
```

**But what if the user types fast — faster than the 'Bar' response?**

```
4a. 'Bar' fetch is IN FLIGHT (hasn't resolved yet)
4b. User types "ce" before 'Bar' responds
    → 300ms → debouncedQuery = "Barce"
    → useQuery: queryKey = ['geocoding', 'Barce']
    → React Query: the 'Bar' query is still IN FLIGHT → ABORTS its signal
    → fetchJson's relayAbort fires → controller.abort() → 'Bar' fetch is CANCELLED at network level
    → 'Barce' fetch starts
    → placeholderData: (prev) => prev → prev is undefined (Bar never resolved) → no placeholder shown
    → Loading indicator shows instead
```

**Key insight — abort vs placeholderData serve different scenarios:**

| Scenario                                       | What happens                        | abort?                                       | placeholderData?                           |
| ---------------------------------------------- | ----------------------------------- | -------------------------------------------- | ------------------------------------------ |
| Previous query **resolved**, new query starts  | Old data is in observer state       | No abort (query already completed)           | Shows old data as placeholder — no flicker |
| Previous query **in flight**, new query starts | Old request is still on the network | Aborts the network request — saves bandwidth | `prev` is undefined → shows loading state  |

These two mechanisms are complementary, not redundant. `placeholderData` handles the "resolved → loading next" transition smoothly. `abort` handles the "in-flight → superseded" case by actually cancelling the network request.

### 5.2.1 Why both React Query's signal AND our fetch AbortController?

React Query passes an `AbortSignal` to the `queryFn`:

```ts
queryFn: ({ signal }) => getForecast(params!, signal),
```

But this signal only tells the `queryFn` "stop caring about this request." If the `queryFn` ignores it and calls `fetch()` without forwarding the signal, the **network request continues** — the response arrives, gets parsed, and then gets thrown away because the query was aborted. The bandwidth was wasted.

Our `fetchJson` bridges this gap:

```ts
// src/lib/api.ts:20
export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const { signal: externalSignal } = options
  const controller = new AbortController()
  const relayAbort = () => controller.abort()
  externalSignal?.addEventListener('abort', relayAbort) // ← relay RQ's signal to our fetch
  try {
    const res = await fetch(url, { signal: controller.signal }) // ← actual network cancellation
    // ...
  } finally {
    externalSignal?.removeEventListener('abort', relayAbort)
  }
}
```

**The two layers:**

1. **React Query's signal** (the "why"): React Query decides the query is stale (unmounted, superseded by a new `queryKey`, or manually cancelled). It aborts the signal. This is the **decision layer**.

2. **fetchJson's AbortController relay** (the "how"): `fetchJson` listens to React Query's signal and forwards the abort to its own `AbortController`, which is passed to `fetch()`. The browser **actually cancels the TCP connection** — no more bytes are sent or received. This is the **execution layer**.

Without the relay, `fetch()` would run to completion even though React Query has moved on. The response would be parsed and then discarded — wasted CPU + bandwidth. With the relay, the request is genuinely cancelled at the network level.

**Additionally**, `fetchJson` adds its own 8-second timeout (`API_TIMEOUT_MS`) using the same `AbortController`. If the server is slow but React Query hasn't aborted (the query is still active), the timeout fires and aborts the fetch. This is a third reason for the relay: one `AbortController` handles both external cancellation AND timeout.

### 5.3 Practical exercise: the forecast cache

**Scenario:** User has 3 favorites (London, Paris, Tokyo). They tap each one, then go back to London.

```
1. Tap London → useForecast({ lat: 51.5, lon: -0.1 })
   → Cache miss → fetch → cache ['forecast', 51.5, -0.1]
   → staleTime: 10 min

2. Tap Paris → useForecast({ lat: 48.8, lon: 2.3 })
   → London's component unmounts, but data stays in cache (gcTime: 30 min)
   → Cache miss for Paris → fetch → cache ['forecast', 48.8, 2.3]

3. Tap Tokyo → same pattern

4. Tap London again (within 10 min of step 1)
   → Cache HIT (staleTime not expired)
   → No API call — instant render
   → If > 10 min had passed: stale → background refetch, but stale data renders first
```

**What we won:**

- Navigating between favorites is instant if you've seen them recently
- Even after 10 minutes, the user sees the old data immediately while a refetch happens in the background (stale-while-revalidate)
- If the user navigates away for 29 minutes and comes back, the data is still in cache (gcTime: 30 min) — served instantly, then refetched as stale

### 5.4 QueryClient global defaults

```ts
// src/main.tsx:7
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 min default
      retry: 1,
      refetchOnWindowFocus: false, // weather doesn't change on tab switch
    },
  },
})
```

`refetchOnWindowFocus: false` is a deliberate choice — weather data doesn't change on tab focus, and refetching on every tab switch would waste API calls. Individual queries can override (e.g., `useGeocodingSearch` sets `retry: false`).

### 5.5 What's missing (improvement opportunities)

- **`useMutation`**: Currently favorites are managed via `useReducer` + localStorage. If favorites moved to a backend, `useMutation` with `onSuccess: invalidateQueries(['favorites'])` would be the pattern.
- **Prefetching**: On the Favorites list, we could `queryClient.prefetchQuery` the forecast for each favorite on hover, so tapping is instant (no loading state).
- **`ensureQueryData`**: For the initial forecast load, `ensureQueryData` would block the route transition until data is ready (with a Suspense fallback), eliminating the skeleton flash.

### 5.6 Error handling

Error handling is layered across three levels: the HTTP layer, the React Query layer, and the UI layer.

#### Level 1: HTTP layer (`src/lib/api.ts`)

`fetchJson` wraps `fetch()` and normalizes all failure modes into a single `ApiError` class:

```ts
export class ApiError extends Error {
  status?: number
  code?: string // 'http' | 'timeout' | 'network'
}

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) {
      throw new ApiError(`Request failed with status ${res.status}`, res.status, 'http')
    }
    return (await res.json()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err // already normalized — rethrow
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (timedOut) {
        throw new ApiError('The weather service took too long to respond.', undefined, 'timeout')
      }
      throw err // aborted by RQ — rethrow raw
    }
    throw new ApiError('Could not reach the weather service.', undefined, 'network')
  }
}
```

Three error codes:

- **`http`**: server responded with non-2xx status (e.g., 404, 500). Includes the status code.
- **`timeout`**: the 8-second `API_TIMEOUT_MS` fired and aborted the request. Distinct from a user-initiated abort.
- **`network`**: `fetch()` threw but not an `AbortError` — DNS failure, no connection, CORS, etc.

**Why normalize:** the UI layer doesn't need to know whether it was a timeout or a DNS failure — it just needs to show "something went wrong, try again." But the `code` field is there for future granular handling (e.g., show "server error" for `http` 500s vs "check your connection" for `network`).

**Why rethrow `AbortError` raw:** React Query expects `AbortError` to know the query was cancelled (not failed). If we wrapped it in `ApiError`, React Query would treat it as a real error and show error state instead of just silently dropping the result.

#### Level 2: React Query layer (`src/hooks/`)

React Query catches the `ApiError` and exposes it via `result.isError` and `result.error`:

```ts
// useForecast — retry: 1 (one retry on transient failures)
useQuery({
  queryKey: ['forecast', ...],
  queryFn: ({ signal }) => getForecast(params!, signal),
  retry: 1,        // ← retry once, then give up
})

// useGeocodingSearch — retry: false (no retry)
useQuery({
  queryKey: ['geocoding', ...],
  queryFn: ({ signal }) => searchCities(trimmed, signal),
  retry: false,    // ← user is actively typing, retrying stale search is pointless
})
```

**Why different retry strategies:**

- **Forecast `retry: 1`**: a transient network blip shouldn't force the user to manually retry. One automatic retry covers most transients. But infinite retries would hammer a dead API.
- **Geocoding `retry: false`**: the user is actively typing. By the time the retry fires, the user has already typed more characters and a new query has started. Retrying a stale search wastes an API call.

React Query's global default is also `retry: 1` (`src/main.tsx:10`), so `useForecast`'s `retry: 1` is redundant but explicit. `useGeocodingSearch` overrides to `false`.

#### Level 3: UI layer (`src/components/` and `src/routes/`)

Errors surface to the user via two patterns:

**Pattern A — full-page error with retry button (Home forecast):**

```tsx
// src/routes/Home.tsx:110
{forecast.isError ? (
  <ErrorSlot>
    <ErrorMessage
      message="Could not load the forecast for this city. Check your connection and try again."
      onRetry={() => forecast.refetch()}
    />
  </ErrorSlot>
) : forecast.isLoading || !forecast.data ? (
  <WeatherHeroSkeleton city={city} />   // loading state
) : (
  <WeatherHero ... />                    // success state
)}
```

The `ErrorMessage` component (`src/components/ui/ErrorMessage.tsx`) shows an alert icon, the message, and a "Try again" button that calls `refetch()` — which re-runs the `queryFn` and, if it succeeds, transitions back to the success state automatically.

**Pattern B — inline dropdown error (Search):**

```tsx
// src/components/search/Search.tsx:343
{canShow && result.isError ? (
  <ErrorWrap>
    <ErrorMessage
      message="Could not load cities. Check your connection and try again."
      onRetry={() => result.refetch()}
    />
  </ErrorWrap>
) : canShow && result.isLoading && cities.length === 0 ? (
  <CenterStatus><Spinner /> Searching…</CenterStatus>
) : canShow && result.isSuccess && cities.length === 0 ? (
  <EmptyState title={`No cities found for "${trimmedQuery}"`} ... />
) : null}
```

The search dropdown handles four states: error (retry button), loading (spinner), empty success ("no cities found"), and success (city list). Each state renders inline within the dropdown — the input remains focused and the user can keep typing.

**Pattern C — silent fallback (FavoriteCard):**

```tsx
// src/components/favorites/FavoriteCard.tsx:28
const loading = forecast.isLoading || !forecast.data || !info || !today
// If forecast fails, `loading` stays true → Skeleton blocks remain visible
// No explicit error UI — the card shows loading indefinitely
```

This is a **known trade-off**: favorite cards don't show an error state. If the forecast API fails for one favorite, the card shows skeleton blocks forever. This was chosen because the Favorites page shows multiple cards — showing error states on each would be visually noisy. An improvement would be to show a compact error indicator on the card.

#### Error flow diagram

```
fetch() fails
  → fetchJson catches → throws ApiError(code: 'http'|'timeout'|'network')
    → queryFn throws → React Query catches
      → retry: 1? → retry once → if still fails:
        → result.isError = true, result.error = ApiError
          → UI: ErrorMessage with "Try again" button
            → user clicks → result.refetch() → new queryFn → new fetch()
```

---

## 6. useReducer

### 6.1 Where it's used

One `useReducer` in the codebase — the favorites store:

```ts
// src/context/favoritesContext.ts:5
export interface FavoritesState {
  items: FavoriteCity[]
}

export type FavoritesAction =
  | { type: 'add'; city: FavoriteCity }
  | { type: 'remove'; key: string }
  | { type: 'toggle'; city: FavoriteCity }

export function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'add':
      if (state.items.some((city) => cityKey(city) === cityKey(action.city))) return state
      return { items: [...state.items, action.city] }
    case 'remove':
      return { items: state.items.filter((city) => cityKey(city) !== action.key) }
    case 'toggle': {
      const key = cityKey(action.city)
      if (state.items.some((city) => cityKey(city) === key)) {
        return { items: state.items.filter((city) => cityKey(city) !== key) }
      }
      return { items: [...state.items, action.city] }
    }
    default:
      return state
  }
}
```

### 6.2 Why useReducer (not useState)

**Problem with useState here:** The `toggle` action requires reading the current state to decide add-vs-remove. With `useState`, you'd write:

```ts
// ❌ Verbose, error-prone with useState
const toggleFavorite = (city) => {
  setFavorites((prev) => {
    const key = cityKey(city)
    if (prev.some((c) => cityKey(c) === key)) {
      return prev.filter((c) => cityKey(c) !== key)
    }
    return [...prev, city]
  })
}
const addFavorite = (city) => {
  setFavorites((prev) => {
    if (prev.some((c) => cityKey(c) === cityKey(city))) return prev
    return [...prev, city]
  })
}
// removeFavorite is simpler but still a function
```

**With useReducer:** The logic lives in a pure function. The component just dispatches intent: `dispatch({ type: 'toggle', city })`. The reducer is:

- **Testable in isolation** (pure function, no React) — see `favoritesReducer` testable without rendering
- **Type-safe** (discriminated union on `action.type` — TS narrows `action.city` vs `action.key`)
- **Centralized** — all state transitions in one place, not scattered across multiple `useState` setters

### 6.3 Lazy initialization (3-arg form)

```ts
// src/context/FavoritesContext.tsx:19
const [state, dispatch] = useReducer(favoritesReducer, { items: [] }, (init) => ({
  items: loadJSON<FavoriteCity[]>(storageKey, init.items),
}))
```

The third argument is a lazy initializer — it runs **once** on mount (not on every render) and reads from localStorage. Without this, you'd need a `useEffect` to hydrate, causing a flash of empty state on first render.

### 6.4 Discriminated union for type-safe actions

```ts
export type FavoritesAction =
  | { type: 'add'; city: FavoriteCity }
  | { type: 'remove'; key: string }
  | { type: 'toggle'; city: FavoriteCity }
```

In the `switch` statement, TS narrows the action type:

- `case 'add'` → `action` is `{ type: 'add'; city: FavoriteCity }` → `action.city` is available
- `case 'remove'` → `action` is `{ type: 'remove'; key: string }` → `action.key` is available

A typo like `action.city` in the `'remove'` case is a compile error.

### 6.5 downshift's stateReducer (bonus)

`useCombobox` from downshift accepts a `stateReducer` that intercepts state transitions — same concept, applied to a library's internal state:

```tsx
// src/components/search/Search.tsx:276
stateReducer: (state, { type, changes }) => {
  if (type === useCombobox.stateChangeTypes.InputBlur) {
    return { isOpen: false, highlightedIndex: -1 }
  }
  if (type === useCombobox.stateChangeTypes.InputKeyDownEnter && ...) {
    return { ...changes, selectedItem: cities[0], inputValue: '', isOpen: false }
  }
  if (changes.selectedItem) {
    return { ...changes, inputValue: '' }
  }
  return changes
}
```

This customizes downshift's default behavior: blur doesn't commit the typed text, Enter with no highlighted item selects the first result, and selecting an item clears the input.

### 6.6 When NOT to use useReducer

The other contexts (Unit, User, Theme, CurrentCity) use `useState`, not `useReducer`. Why:

- **Unit**: two values (celsius/fahrenheit) — `useState<TempUnit>('celsius')` is simpler than a reducer with one action
- **User**: one string — `useState<string>(DEFAULT_USERNAME)`
- **CurrentCity**: one `City | null` — `useState<City | null>(null)`

**Rule of thumb:** use `useReducer` when state transitions depend on current state (like `toggle`) or when you have 3+ related actions. Use `useState` for independent primitive values.

---

## 7. useRef

### 7.1 Where it's used

One `useRef` in the codebase:

```ts
// src/hooks/useGeolocatedCity.ts:12
const requestedRef = useRef(false)
```

### 7.2 What it does — run-once guard

```ts
useEffect(() => {
  if (!enabled || requestedRef.current) return // ← guard: skip if already requested
  requestedRef.current = true // ← latch: mark as requested

  // ... geolocation logic ...

  return () => {
    cancelled = true
    controller.abort()
    requestedRef.current = false // ← reset: allow re-request on re-enable
  }
}, [enabled])
```

**Purpose:** Prevents `navigator.geolocation.getCurrentPosition` from firing more than once per effect lifecycle. Even if the effect re-runs (React strict mode double-invokes effects in dev), the ref blocks the second call.

### 7.3 Why useRef (not a useState or closure variable)

| Approach                                            | Problem                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `useState(false)`                                   | Setting state triggers a re-render — we don't need to render based on this flag, so it's wasteful |
| Plain `let requested = false` in the component body | Resets on every render — the guard would fail after the first re-render                           |
| `useRef(false)`                                     | Persists across renders without triggering re-renders — the ideal "mutable instance variable"     |

### 7.4 The ref + closure flag combo

This effect uses **two** cancellation mechanisms:

```ts
let cancelled = false // closure variable — guards geolocation callbacks
const controller = new AbortController() // aborts the reverse-geocode fetch
const requestedRef = useRef(false) // ref — prevents re-requesting geolocation
```

**Why both:**

- `navigator.geolocation.getCurrentPosition` doesn't accept an `AbortSignal` — you can't cancel the geolocation request itself. The `cancelled` closure flag is the only way to ignore its callback after unmount.
- `reverseGeocodeCity` (called inside the geolocation success callback) **does** accept a signal — `controller.abort()` cancels the HTTP fetch.
- `requestedRef` prevents re-triggering geolocation if the effect re-runs (React strict mode, or `enabled` toggling).

### 7.5 The cleanup contract

```ts
return () => {
  cancelled = true // 1. ignore any pending geolocation callback
  controller.abort() // 2. abort the reverse-geocode HTTP fetch
  requestedRef.current = false // 3. allow geolocation to be re-requested if re-enabled
}
```

This is a complete cleanup: it handles both async paths (geolocation callback + HTTP fetch) and resets the guard for future invocations. Missing any of these three lines would cause a bug:

- Without `cancelled = true`: the success callback could call `setCity` after unmount → React warning + potential state update on unmounted component
- Without `controller.abort()`: the HTTP fetch completes and wastes bandwidth, and its `.then()` could run `setCity` after unmount
- Without `requestedRef.current = false`: if `enabled` toggles false→true again, geolocation wouldn't fire because the ref is still `true`

### 7.6 When NOT to use useRef

There are no DOM refs in this codebase (no `ref={inputRef}` to focus an input, no `ref={measureRef}` to measure dimensions). If we needed to programmatically focus the search input after selecting a city, that would be a valid `useRef` use case:

```tsx
// Hypothetical: focus search after selection
const inputRef = useRef<HTMLInputElement>(null)
const handleSelect = (city: City) => {
  onSelect(city)
  inputRef.current?.focus()
}
```

But downshift's `getInputProps` already handles focus management internally, so we don't need it.
