import { describe, it, expect } from 'vitest'
import { flagEmoji } from './flag'

describe('flag helpers', () => {
  describe('flagEmoji', () => {
    it('converts a 2-letter country code to a flag emoji', () => {
      expect(flagEmoji('ES')).toBe('🇪🇸')
      expect(flagEmoji('FR')).toBe('🇫🇷')
      expect(flagEmoji('JP')).toBe('🇯🇵')
    })

    it('is case-insensitive', () => {
      expect(flagEmoji('es')).toBe('🇪🇸')
    })

    it('returns an empty string for invalid input', () => {
      expect(flagEmoji('')).toBe('')
      expect(flagEmoji('ESP')).toBe('')
    })
  })
})
