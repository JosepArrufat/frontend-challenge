import { describe, it, expect } from 'vitest'
import { getWeatherInfo, getWeatherLabel } from './weatherCodes'

describe('weatherCodes', () => {
  it('maps clear sky to the Sun icon', () => {
    expect(getWeatherInfo(0)).toEqual({ label: 'Clear sky', icon: 'Sun' })
  })

  it('maps overcast to the Cloud icon', () => {
    expect(getWeatherInfo(3)).toEqual({ label: 'Overcast', icon: 'Cloud' })
  })

  it('maps rain codes to a rain icon', () => {
    expect(getWeatherInfo(61).icon).toBe('CloudRain')
    expect(getWeatherInfo(63).icon).toBe('CloudRain')
    expect(getWeatherInfo(65).icon).toBe('CloudRain')
  })

  it('maps snow codes to a snow icon', () => {
    expect(getWeatherInfo(71).icon).toBe('CloudSnow')
    expect(getWeatherInfo(77).icon).toBe('Snowflake')
  })

  it('maps thunderstorm codes to the lightning icon', () => {
    expect(getWeatherInfo(95).icon).toBe('CloudLightning')
    expect(getWeatherInfo(99).icon).toBe('CloudLightning')
  })

  it('returns a fallback for unknown codes', () => {
    expect(getWeatherInfo(9999)).toEqual({ label: 'Unknown conditions', icon: 'Cloud' })
  })

  it('exposes the label through getWeatherLabel', () => {
    expect(getWeatherLabel(3)).toBe('Overcast')
    expect(getWeatherLabel(9999)).toBe('Unknown conditions')
  })
})
