function toDate(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(iso)
}

export function roundTemp(value: number, fractionDigits = 0): number {
  const factor = 10 ** fractionDigits
  return Math.round(value * factor) / factor
}

export function formatTemperature(value: number, fractionDigits = 0): string {
  return `${roundTemp(value, fractionDigits)}°`
}

export function formatHour(iso: string, timezone?: string): string {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone,
  }).format(new Date(iso))
}

export function formatDayShort(iso: string): string {
  return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(toDate(iso))
}

export function formatDayName(iso: string): string {
  return new Intl.DateTimeFormat('en', { weekday: 'long' }).format(toDate(iso))
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(toDate(iso))
}

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function isToday(iso: string, timezone?: string): boolean {
  const formatter = timezone
    ? new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: timezone,
      })
    : dayKeyFormatter
  return formatter.format(new Date(iso)) === formatter.format(new Date())
}
