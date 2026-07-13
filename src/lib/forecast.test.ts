import { describe, it, expect } from 'vitest'
import { getHourlySlice, getDailyEntries } from './forecast'
import type { Forecast } from '../types'

/** Builds a date string relative to a fixed anchor date. */
function relDate(anchor: string, offsetDays: number): string {
  const d = new Date(anchor + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

/** Builds a 30-day window identical to the API response:
 *  14 past days + today + 15 future days = 30 entries. */
function build30DayForecast(todayStr: string): Forecast {
  const times: string[] = []
  const max: number[] = []
  const min: number[] = []
  const codes: number[] = []
  const rises: string[] = []
  const sets: string[] = []

  for (let i = -14; i <= 15; i++) {
    const date = relDate(todayStr, i)
    times.push(date)
    max.push(20 + i)
    min.push(10 + i)
    codes.push(i === 0 ? 3 : 1)
    rises.push(date + 'T05:00')
    sets.push(date + 'T21:00')
  }

  return {
    timezone: 'UTC',
    current: {
      time: todayStr + 'T12:00',
      temperature: 20,
      apparentTemperature: 19,
      relativeHumidity: 60,
      surfacePressure: 1015,
      windSpeed: 10,
      weatherCode: 3,
      uvIndex: 3,
      visibility: 10000,
    },
    hourly: { time: [], temperature: [], weatherCode: [] },
    daily: {
      time: times,
      temperatureMax: max,
      temperatureMin: min,
      weatherCode: codes,
      sunrise: rises,
      sunset: sets,
    },
  }
}

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

  it('returns exactly 30 entries for the sprint 14-past + today + 15-future window', () => {
    const todayStr = '2026-07-13'
    const entries = getDailyEntries(build30DayForecast(todayStr))
    expect(entries).toHaveLength(30)
  })

  it('marks the first 14 entries as historical and none of the last 15 as historical', () => {
    const todayStr = '2026-07-13'
    const entries = getDailyEntries(build30DayForecast(todayStr))
    const pastEntries = entries.filter((e) => e.historical)
    const futureEntries = entries.filter((e) => !e.historical && !e.isToday)
    expect(pastEntries).toHaveLength(14)
    expect(futureEntries).toHaveLength(15)
  })

  it('marks exactly one entry as today', () => {
    const todayStr = '2026-07-13'
    const entries = getDailyEntries(build30DayForecast(todayStr))
    const todayEntries = entries.filter((e) => e.isToday)
    expect(todayEntries).toHaveLength(1)
    expect(todayEntries[0].date).toBe(todayStr)
  })

  it('today entry is not historical', () => {
    const todayStr = '2026-07-13'
    const entries = getDailyEntries(build30DayForecast(todayStr))
    const todayEntry = entries.find((e) => e.isToday)
    expect(todayEntry?.historical).toBe(false)
  })
})
