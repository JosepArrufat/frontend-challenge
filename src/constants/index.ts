export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export const SEARCH_RESULTS_COUNT = 5
export const MIN_SEARCH_LENGTH = 2
export const SEARCH_DEBOUNCE_MS = 300

export const FORECAST_DAYS = 16
export const PAST_DAYS = 14
export const FORECAST_TOTAL_DAYS = FORECAST_DAYS + PAST_DAYS
export const DAILY_PAGE_SIZE = 5
export const HOURLY_SLICE_HOURS = 24

export const API_TIMEOUT_MS = 8000
export const FORECAST_STALE_TIME = 1000 * 60 * 10

export const FAVORITES_STORAGE_KEY = 'wf:favorites'
