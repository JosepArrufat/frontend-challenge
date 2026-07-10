import { describe, it, expect } from 'vitest'
import { getHourlySlice, getDailyEntries } from './forecast'
import type { Forecast } from '../types'

function buildForecast(overrides?: Partial<Forecast>): Forecast {
  return {
    timezone: 'UTC',
    current: {
      time: '2025-06-01T14:00',
      temperature: 20,
      apparentTemperature: 19,
      relativeHumidity: 60,
      surfacePressure: 1015,
      windSpeed: 10,
      weatherCode: 3,
      uvIndex: 5.2,
      visibility: 12000,
    },
    hourly: {
      time: ['2025-06-01T13:00', '2025-06-01T14:00', '2025-06-01T15:00', '2025-06-01T16:00'],
      temperature: [18, 20, 21, 22],
      weatherCode: [1, 3, 3, 2],
    },
    daily: {
      time: ['2025-05-31', '2025-06-01', '2025-06-02'],
      temperatureMax: [25, 26, 24],
      temperatureMin: [14, 15, 13],
      weatherCode: [0, 3, 61],
      sunrise: ['2025-05-31T05:00', '2025-06-01T05:00', '2025-06-02T05:00'],
      sunset: ['2025-05-31T21:00', '2025-06-01T21:00', '2025-06-02T21:00'],
    },
    ...overrides,
  }
}

describe('getHourlySlice', () => {
  it('starts at the current hour and marks it as now', () => {
    const entries = getHourlySlice(buildForecast(), 24)
    expect(entries[0]).toEqual({
      time: '2025-06-01T14:00',
      temperature: 20,
      weatherCode: 3,
      isNow: true,
    })
    expect(entries[1].isNow).toBe(false)
  })

  it('slices up to the requested number of hours', () => {
    const entries = getHourlySlice(buildForecast(), 2)
    expect(entries).toHaveLength(2)
    expect(entries[1].time).toBe('2025-06-01T15:00')
  })

  it('clamps to the available hourly data', () => {
    const entries = getHourlySlice(buildForecast(), 24)
    expect(entries).toHaveLength(3)
  })

  it('falls back to the first hour when current time is before the series', () => {
    const f = buildForecast({
      current: { ...buildForecast().current, time: '2025-06-01T10:00' },
    })
    const entries = getHourlySlice(f, 24)
    expect(entries[0].time).toBe('2025-06-01T13:00')
    expect(entries[0].isNow).toBe(true)
  })
})

describe('getDailyEntries', () => {
  it('maps each day with max, min, weather code and flags', () => {
    const entries = getDailyEntries(buildForecast({ timezone: 'UTC' }))
    expect(entries).toHaveLength(3)
    expect(entries[1]).toMatchObject({
      date: '2025-06-01',
      max: 26,
      min: 15,
      weatherCode: 3,
    })
  })

  it('flags days before today as historical', () => {
    const entries = getDailyEntries(buildForecast({ timezone: 'UTC' }))
    const today = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    }).format(new Date())
    const todayEntry = entries.find((e) => e.date === today)
    const pastEntry = entries.find((e) => e.date < today)
    if (todayEntry) expect(todayEntry.isToday).toBe(true)
    if (pastEntry) expect(pastEntry.historical).toBe(true)
  })
})
