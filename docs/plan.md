# WF-24 · Weather Forecast — Implementation Plan

> Derived from `docs/sprint-24.md`. Goal: deliver a clean, maintainable MVP.

---

## 1. Goal & Scope

Deliver a Weather Forecast MVP where users can:

- Search any city worldwide (US-001)
- View current conditions + hourly + 30-day forecast (US-002)
- Save favorite cities that persist between sessions (US-003)
- Browse the 30-day forecast with pagination (US-004)
- (Optional) Responsive layout (US-005)

Hard requirements: **React + TypeScript**. Everything else is our choice.

---

## 2. Technology Stack

| Concern         | Choice                           | Why                                                                |
| --------------- | -------------------------------- | ------------------------------------------------------------------ |
| Build tool      | **Vite**                         | Fast HMR, first-class React+TS template, minimal config            |
| Language        | **TypeScript**                   | Required; type safety for API responses                            |
| UI framework    | **React 18**                     | Required                                                           |
| Routing         | **React Router v6**              | Clean separation of Home (`/`) and Favorites (`/favorites`) pages  |
| Server state    | **TanStack React Query**         | Caching, loading/error states, retries, dedup — fits async weather |
| Client state    | **React Context + useReducer**   | Favorites are global + persisted; no heavyweight store needed      |
| Data fetching   | **native `fetch`**               | No extra dep; React Query wraps it                                 |
| Styling         | **Tailwind CSS**                 | Utility-first, consistent, trivial responsive (helps US-005)       |
| Icons           | **lucide-react**                 | Tree-shakeable, clean UI icons; weather mapped from WMO codes      |
| Date formatting | **native `Intl.DateTimeFormat`** | No date lib needed for our cases                                   |
| Lint/format     | **ESLint + Prettier**            | Consistent style (Vite provides ESLint baseline)                   |
| Testing         | **Vitest + Testing Library**     | Same toolchain as Vite; light unit/component coverage              |

> Trade-off note: we deliberately avoid Redux/Zustand. React Query handles server state, Context handles the only piece of shared client state (favorites). Fewer moving parts = more maintainable for an MVP.

---

## 3. Project Structure

```
src/
  main.tsx                  # App entry + providers (Router, QueryClient, Favorites)
  App.tsx                   # Routes + layout shell
  routes/
    Home.tsx                # Search + Weather hero + hourly + daily + pagination
    Favorites.tsx           # Saved cities list → click to load forecast
  components/
    search/
      Search.tsx            # Input + debounce + keyboard nav
      SearchSuggestions.tsx # Dropdown of matching cities
    weather/
      WeatherHero.tsx       # Current conditions (temp, condition, feels like, humidity, pressure, wind)
      HourlyForecast.tsx    # Next 24h horizontal strip
      DailyForecast.tsx     # Current page of 30-day forecast (cards)
      ForecastPagination.tsx# Prev/Next + page indicator + empty state
    favorites/
      FavoriteButton.tsx    # Toggle favorite on selected city
      FavoriteCard.tsx      # City chip in favorites list/page
    ui/
      Spinner.tsx
      ErrorMessage.tsx
      EmptyState.tsx
      WeatherIcon.tsx       # WMO code → icon/label
  hooks/
    useDebounce.ts
    useGeocodingSearch.ts   # React Query: geocoding
    useForecast.ts          # React Query: forecast (lat/lon)
    useFavorites.ts         # Consume FavoritesContext
  context/
    FavoritesContext.tsx    # Reducer + localStorage persistence
  lib/
    api.ts                  # fetch wrapper + error normalization
    geocoding.ts            # searchCities(name)
    forecast.ts             # getForecast({lat,lon})
    weatherCodes.ts         # WMO code → { label, icon } map
    storage.ts              # typed localStorage get/set
    format.ts               # temp, date, time formatters
  types/
    index.ts                # City, Forecast, CurrentWeather, Hourly, Daily, Favorite
  constants/
    index.ts                # API URLs, page size, defaults
```

**Why this structure:** feature-based grouping under `components/`, with `lib/` for framework-agnostic logic (easy to unit-test), `hooks/` as the data-access boundary for components, and `context/` for cross-cutting client state. Components stay presentational; data lives in hooks/lib.

---

## 4. API Integration (Open-Meteo, no key required)

### Geocoding — `https://geocoding-api.open-meteo.com/v1/search`

Params: `name`, `count=5`, `language=en`. Use `latitude`/`longitude` + `id` + `name` + `country`/`country_code`.

### Forecast — `https://api.open-meteo.com/v1/forecast`

- `current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`
- `hourly=temperature_2m,weather_code`
- `daily=temperature_2m_max,temperature_2m_min,weather_code`
- `forecast_days=16` + `past_days=14` → **30 days total** (see challenge #1)
- `timezone=auto`

### WMO weather code mapping

Implement `weatherCodes.ts`: a record mapping each code to `{ label, icon }` (e.g. `0` → Clear sky / Sun, `61` → Rain / CloudRain, `71` → Snow / CloudSnow, `3` → Overcast). Cover the full WMO list from Open-Meteo docs.

---

## 5. Main Challenges & Mitigations

1. **30-day forecast when API caps `forecast_days` at 16.**
   Combine `past_days=14` + `forecast_days=16` = 30 entries. Mark each day as historical (actual) vs forecast so the UI can visually distinguish (e.g. muted style / "observed" tag). Sort ascending by date. _This is the documented approach in the sprint spec._

2. **"Next 24 hours" hourly slice.**
   `hourly.time` is local (timezone=auto) ISO strings. Find the index of the current hour from `current.time` and slice the next 24 entries. Guard against array bounds.

3. **Search UX: debounce + suggestions + keyboard nav + a11y.**
   `useDebounce` (≈300ms) feeding React Query; suggestions dropdown with `aria-activedescendant`, ArrowUp/Down/Enter/Escape; clear-on-select; dismiss on outside click.

4. **Two-step data flow (geocode → forecast).**
   Keep the selected `City` in component/route state; `useForecast` keyed by `lat,lon` so React Query caches per location. Selecting a favorite reuses cached forecast when available.

5. **Favorites: shared, persisted, no duplicates.**
   `FavoritesContext` with a reducer (`add`/`remove`/`toggle` keyed by city `id`), persisted to `localStorage` via a `storage.ts` helper with JSON parse guards. Subscribe once at app root.

6. **Consistent loading / error / empty states.**
   Reusable `ui/` primitives driven by React Query's `isLoading`/`isError`/`data`. Friendly empty state for "no favorites" and "no forecast / past-only edge".

7. **Pagination of the 30-day list.**
   Page size = 5 days. Slice the 30-entry daily array by `(page-1)*size`. Prev/Next disabled at bounds; current page indicator; empty state when no city selected.

8. **Timezone correctness.**
   Rely on API `timezone=auto` for display strings; use `Intl` with the returned `timezone` field when formatting, so "today" and "next 24h" align with the location, not the user's machine.

9. **Responsive layout (optional US-005).**
   Tailwind breakpoints; hero reflows, hourly strip scrolls horizontally, daily grid 1→2→3→5 columns, favorites become a page on mobile.

---

## 6. Detailed Plan (mapped to User Stories / sub-tasks)

### Phase 0 — Bootstrap (no US)

- [ ] Create feature branch `feat/wf-24-weather-forecast`
- [ ] `npm create vite@latest . -- --template react-ts`
- [ ] Install deps: `@tanstack/react-query`, `react-router-dom`, `tailwindcss` (+ postcss/autoprefixer), `lucide-react`
- [ ] Install dev deps: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `prettier`
- [ ] Configure Tailwind, ESLint, Prettier; verify `npm run build` + `npm run lint`
- [ ] Create folder skeleton, set up `QueryClientProvider` + `Router` + `FavoritesProvider` in `main.tsx`
- [ ] Commit: `chore: scaffold weather forecast app`

### Phase 1 — Foundation (WF-25 partial, WF-29 partial)

- [ ] `types/index.ts`: `City`, `GeocodingResponse`, `ForecastResponse`, `CurrentWeather`, `HourlyData`, `DailyData`, `Favorite`
- [ ] `lib/api.ts`: `fetchJson` with timeout + normalized `ApiError`
- [ ] `lib/geocoding.ts`: `searchCities(name): Promise<City[]>`
- [ ] `lib/forecast.ts`: `getForecast({lat,lon}): Promise<Forecast>`
- [ ] `lib/weatherCodes.ts`: full WMO map
- [ ] `lib/storage.ts`, `lib/format.ts`, `constants/index.ts`
- [ ] Unit tests for `weatherCodes` + `format`
- [ ] Commit: `feat(api): add open-meteo client and weather code mapping`

### Phase 2 — US-001 Search (WF-25, WF-26, WF-27, WF-28)

- [ ] `useDebounce`, `useGeocodingSearch` (React Query, `enabled` when query length ≥ 2)
- [ ] `Search.tsx` + `SearchSuggestions.tsx` with keyboard nav + a11y
- [ ] Loading (spinner) + error (message + retry) + no-results states
- [ ] On select → lift `City` to Home state → triggers forecast
- [ ] Commit: `feat(search): city search with suggestions and state handling`

### Phase 3 — US-002 Weather display (WF-29, WF-30, WF-31, WF-32)

- [ ] `useForecast({lat,lon})` (React Query, staleTime ~10 min)
- [ ] `WeatherHero.tsx`: temp, condition + icon, feels-like, humidity, pressure, wind
- [ ] `HourlyForecast.tsx`: next 24h strip (time + icon + temp), horizontal scroll
- [ ] `DailyForecast.tsx`: renders the current page slice (date + icon + max/min)
- [ ] Loading/error/empty states for the hero + sections
- [ ] Commit: `feat(weather): current, hourly and daily forecast components`

### Phase 4 — US-004 Pagination (WF-36, WF-37, WF-38)

- [ ] `ForecastPagination.tsx`: page size 5, Prev/Next, "Page x of y", disabled bounds
- [ ] Pagination state in Home; reset to page 1 when city changes
- [ ] Empty state when no forecast/no city
- [ ] Commit: `feat(forecast): 30-day forecast pagination`

### Phase 5 — US-003 Favorites (WF-33, WF-34, WF-35)

- [ ] `FavoritesContext` + reducer (`add`/`remove`/`toggle`, dedupe by `id`)
- [ ] `storage.ts` persistence (load on init, save on change, JSON guard)
- [ ] `FavoriteButton.tsx` on the hero (reflects current selection)
- [ ] `/favorites` route: `FavoritesList` of cards → click loads forecast (navigate home with city)
- [ ] Prevent duplicates; empty state
- [ ] Commit: `feat(favorites): persisted favorite cities with management UI`

### Phase 6 — US-005 Responsive (optional; WF-39 → WF-42)

- [ ] Mobile-first Tailwind layout pass: hero, hourly scroll, daily grid, favorites page, nav
- [ ] Responsive header/nav (Home / Favorites)
- [ ] Commit: `feat(layout): responsive layout across pages`

### Phase 7 — Polish & Review prep

- [ ] Error boundary at app root
- [ ] Lighthouse-ish a11y pass: labels, focus states, `aria-*` on search/pagination
- [ ] A few component tests (Search, FavoriteButton, ForecastPagination logic)
- [ ] `npm run lint`, `npm run build` clean
- [ ] Write `README.md` (setup, run, architecture, decisions, improvements, AI tools)
- [ ] Fill `docs/sprint-review.md`
- [ ] Commit: `docs: add readme and sprint review notes`

---

## 7. Git Workflow

- Branch: `feat/wf-24-weather-forecast` off `main`
- Small, scoped commits per phase (messages above)
- Push branch; PR-ready at end (no force-push to main)

---

## 8. Definition of Done (from sprint-24)

- [ ] US-001 → US-004 complete (US-005 optional)
- [ ] App builds (`npm run build`) with no errors
- [ ] No visible runtime errors
- [ ] README completed
- [ ] `docs/sprint-review.md` completed
- [ ] Lint + typecheck clean

---

## 9. Risks & Trade-offs

| Risk / Trade-off                               | Mitigation                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| 30-day = 14 past + 16 future (mixed semantics) | Visually distinguish observed vs forecast; document in README      |
| React Query adds a dep                         | Removes far more boilerplate (cache/loading/error) than it adds    |
| Tailwind utility classes in JSX                | Acceptable for MVP; extract repeated patterns into components      |
| localStorage only (no sync across tabs)        | Fine for MVP; note `storage` event listener as future improvement  |
| No auth / no backend                           | Out of scope; favorites client-side only                           |
| Limited tests                                  | Cover pure logic (weatherCodes, format, pagination slice) + 1-2 UI |

---

## 10. Future Improvements (for README / sprint review)

- Geolocation ("use my location") default city
- Unit toggle (°C/°F, km/h vs mph)
- Multi-tab favorites sync via `storage` event
- Better weather icon set / animations
- E2E tests (Playwright), CI pipeline
- Virtualized hourly list, chart visualization
- Offline cache via service worker
