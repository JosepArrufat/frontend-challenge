import { describe, it, expect } from 'vitest'
import {
  roundTemp,
  formatTemperature,
  formatHour,
  formatDayShort,
  formatDayName,
  formatDate,
  isToday,
} from './format'

describe('format', () => {
  describe('roundTemp', () => {
    it('rounds to whole degrees by default', () => {
      expect(roundTemp(22.45)).toBe(22)
      expect(roundTemp(22.5)).toBe(23)
    })

    it('rounds to the requested precision', () => {
      expect(roundTemp(22.44, 1)).toBe(22.4)
      expect(roundTemp(22.45, 1)).toBe(22.5)
    })
  })

  describe('formatTemperature', () => {
    it('appends a degree symbol', () => {
      expect(formatTemperature(22.4)).toBe('22°')
      expect(formatTemperature(22.45, 1)).toBe('22.5°')
    })
  })

  describe('formatHour', () => {
    it('formats an ISO hour in 12-hour notation', () => {
      expect(formatHour('2025-06-01T14:00:00Z', 'UTC')).toBe('2 PM')
    })
  })

  describe('formatDayShort', () => {
    it('returns the short weekday for a date-only string', () => {
      expect(formatDayShort('2025-06-01')).toBe('Sun')
    })
  })

  describe('formatDayName', () => {
    it('returns the long weekday for a date-only string', () => {
      expect(formatDayName('2025-06-01')).toBe('Sunday')
    })
  })

  describe('formatDate', () => {
    it('returns a short month and day', () => {
      expect(formatDate('2025-06-01')).toBe('Jun 1')
    })
  })

  describe('isToday', () => {
    it('returns false for a past date', () => {
      expect(isToday('2000-01-01')).toBe(false)
    })
  })
})
