export interface City {
  id: number
  name: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
}

export interface FavoriteCity extends City {}

export interface GeocodingResult {
  id: number
  name: string
  country?: string
  country_code?: string
  latitude: number
  longitude: number
}

export interface GeocodingResponse {
  results?: GeocodingResult[]
}

export interface CurrentWeather {
  time: string
  temperature: number
  apparentTemperature: number
  relativeHumidity: number
  surfacePressure: number
  windSpeed: number
  weatherCode: number
}

export interface HourlyData {
  time: string[]
  temperature: number[]
  weatherCode: number[]
}

export interface DailyData {
  time: string[]
  temperatureMax: number[]
  temperatureMin: number[]
  weatherCode: number[]
}

export interface Forecast {
  timezone: string
  current: CurrentWeather
  hourly: HourlyData
  daily: DailyData
}

export interface ForecastResponse {
  timezone: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    surface_pressure: number
    wind_speed_10m: number
    weather_code: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
  }
}
