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

export type TempUnit = 'celsius' | 'fahrenheit'

export function convertTemp(celsius: number, unit: TempUnit): number {
  return unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius
}

export function formatTemp(celsius: number, unit: TempUnit, fractionDigits = 0): string {
  return `${roundTemp(convertTemp(celsius, unit), fractionDigits)}°`
}

const hourFormatter = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  hour12: true,
})

const dayShortFormatter = new Intl.DateTimeFormat('en', { weekday: 'short' })

const dayNameFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' })

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const tzHourCache = new Map<string, Intl.DateTimeFormat>()
const tzDayKeyCache = new Map<string, Intl.DateTimeFormat>()

function getTzHourFormatter(timezone: string): Intl.DateTimeFormat {
  let f = tzHourCache.get(timezone)
  if (!f) {
    f = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true, timeZone: timezone })
    tzHourCache.set(timezone, f)
  }
  return f
}

function getTzDayKeyFormatter(timezone: string): Intl.DateTimeFormat {
  let f = tzDayKeyCache.get(timezone)
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timezone,
    })
    tzDayKeyCache.set(timezone, f)
  }
  return f
}

export function formatHour(iso: string, timezone?: string): string {
  const f = timezone ? getTzHourFormatter(timezone) : hourFormatter
  return f.format(new Date(iso))
}

export function formatDayShort(iso: string): string {
  return dayShortFormatter.format(toDate(iso))
}

export function formatDayName(iso: string): string {
  return dayNameFormatter.format(toDate(iso))
}

export function formatDate(iso: string): string {
  return dateFormatter.format(toDate(iso))
}

export function isToday(iso: string, timezone?: string): boolean {
  const f = timezone ? getTzDayKeyFormatter(timezone) : dayKeyFormatter
  return f.format(new Date(iso)) === f.format(new Date())
}

export function todayKey(timezone?: string): string {
  const f = timezone ? getTzDayKeyFormatter(timezone) : dayKeyFormatter
  return f.format(new Date())
}

const timeFormatter = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const tzTimeCache = new Map<string, Intl.DateTimeFormat>()
const tzWeekdayCache = new Map<string, Intl.DateTimeFormat>()

function getTzTimeFormatter(timezone: string): Intl.DateTimeFormat {
  let f = tzTimeCache.get(timezone)
  if (!f) {
    f = new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    })
    tzTimeCache.set(timezone, f)
  }
  return f
}

function getTzWeekdayFormatter(timezone: string): Intl.DateTimeFormat {
  let f = tzWeekdayCache.get(timezone)
  if (!f) {
    f = new Intl.DateTimeFormat('en', { weekday: 'long', timeZone: timezone })
    tzWeekdayCache.set(timezone, f)
  }
  return f
}

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}

export function formatCurrentTime(timezone: string): string {
  return getTzTimeFormatter(timezone).format(new Date())
}

export function currentWeekday(timezone: string): string {
  return getTzWeekdayFormatter(timezone).format(new Date())
}

export function uvLabel(uv: number): string {
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}

export function formatVisibility(meters: number): string {
  const km = Math.round(meters / 1000)
  return `${km} km`
}
