import { fetchJson } from './api'
import { FORECAST_URL, FORECAST_DAYS, PAST_DAYS, HOURLY_SLICE_HOURS } from '../constants'
import { todayKey } from './format'
import type { Forecast, ForecastResponse, HourlyEntry, DailyEntry } from '../types'

export interface ForecastParams {
  latitude: number
  longitude: number
}

export async function getForecast(
  { latitude, longitude }: ForecastParams,
  signal?: AbortSignal,
): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code,uv_index,visibility',
    hourly: 'temperature_2m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset',
    forecast_days: String(FORECAST_DAYS),
    past_days: String(PAST_DAYS),
    timezone: 'auto',
  })

  const data = await fetchJson<ForecastResponse>(`${FORECAST_URL}?${params.toString()}`, { signal })

  return {
    timezone: data.timezone,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      relativeHumidity: data.current.relative_humidity_2m,
      surfacePressure: data.current.surface_pressure,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      uvIndex: data.current.uv_index,
      visibility: data.current.visibility,
    },
    hourly: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      weatherCode: data.hourly.weather_code,
    },
    daily: {
      time: data.daily.time,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      weatherCode: data.daily.weather_code,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
    },
  }
}

function findCurrentHourIndex(hourlyTime: string[], currentIso: string): number {
  const exact = hourlyTime.indexOf(currentIso)
  if (exact !== -1) return exact
  for (let i = 0; i < hourlyTime.length; i++) {
    if (hourlyTime[i] >= currentIso) return i
  }
  return 0
}

export function getHourlySlice(forecast: Forecast, hours = HOURLY_SLICE_HOURS): HourlyEntry[] {
  const start = findCurrentHourIndex(forecast.hourly.time, forecast.current.time)
  const end = Math.min(start + hours, forecast.hourly.time.length)
  const entries: HourlyEntry[] = []
  for (let i = start; i < end; i++) {
    entries.push({
      time: forecast.hourly.time[i],
      temperature: forecast.hourly.temperature[i],
      weatherCode: forecast.hourly.weatherCode[i],
      isNow: i === start,
    })
  }
  return entries
}

export function getDailyEntries(forecast: Forecast): DailyEntry[] {
  const today = todayKey(forecast.timezone)
  const entries: DailyEntry[] = []
  for (let i = 0; i < forecast.daily.time.length; i++) {
    const date = forecast.daily.time[i]
    entries.push({
      date,
      max: forecast.daily.temperatureMax[i],
      min: forecast.daily.temperatureMin[i],
      weatherCode: forecast.daily.weatherCode[i],
      historical: date < today,
      isToday: date === today,
    })
  }
  return entries
}

export function getTodaySunTimes(forecast: Forecast): { sunrise: string; sunset: string } {
  const today = todayKey(forecast.timezone)
  const idx = forecast.daily.time.indexOf(today)
  if (idx === -1) {
    return { sunrise: '', sunset: '' }
  }
  return {
    sunrise: forecast.daily.sunrise[idx],
    sunset: forecast.daily.sunset[idx],
  }
}
