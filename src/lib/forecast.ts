import { fetchJson } from './api'
import { FORECAST_URL, FORECAST_DAYS, PAST_DAYS } from '../constants'
import type { Forecast, ForecastResponse } from '../types'

export interface ForecastParams {
  latitude: number
  longitude: number
}

export async function getForecast({ latitude, longitude }: ForecastParams): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code',
    hourly: 'temperature_2m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    forecast_days: String(FORECAST_DAYS),
    past_days: String(PAST_DAYS),
    timezone: 'auto',
  })

  const data = await fetchJson<ForecastResponse>(`${FORECAST_URL}?${params.toString()}`)
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
    },
  }
}
