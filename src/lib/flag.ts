export function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return ''
  const base = 0x1f1e6
  const chars = [...countryCode.toUpperCase()].map((c) => base + c.charCodeAt(0) - 65)
  return String.fromCodePoint(...chars)
}
