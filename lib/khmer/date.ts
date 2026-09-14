import { MAX_YEAR, MIN_YEAR } from "./constants"

/**
 * Plain calendar dates, handled as Julian Day Numbers (JDN) so that
 * nothing depends on the host timezone.
 */
export interface YMD {
  year: number
  month: number
  day: number
}

export function isGregorianLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function daysInGregorianMonth(year: number, month: number) {
  if (month === 2) return isGregorianLeapYear(year) ? 29 : 28
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
}

export function toJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

export function fromJdn(jdn: number): YMD {
  const a = jdn + 32044
  const b = Math.floor((4 * a + 3) / 146097)
  const c = a - Math.floor((146097 * b) / 4)
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)
  return {
    year: 100 * b + d - 4800 + Math.floor(m / 10),
    month: m + 3 - 12 * Math.floor(m / 10),
    day: e - Math.floor((153 * m + 2) / 5) + 1,
  }
}

/** 0 = Sunday … 6 = Saturday */
export function weekdayOf(jdn: number) {
  return (jdn + 1) % 7
}

export function assertYearInRange(year: number) {
  if (year < MIN_YEAR || year > MAX_YEAR) {
    throw new RangeError(
      `Year ${year} is outside the supported range ${MIN_YEAR}–${MAX_YEAR}`
    )
  }
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseISODate(value: string): YMD {
  const match = ISO_DATE.exec(value)
  if (!match) {
    throw new RangeError(`Invalid date "${value}", expected YYYY-MM-DD`)
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > daysInGregorianMonth(year, month)) {
    throw new RangeError(`Invalid date "${value}"`)
  }
  assertYearInRange(year)
  return { year, month, day }
}

export const pad = (n: number, length = 2) => String(n).padStart(length, "0")

export function toISO({ year, month, day }: YMD) {
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}`
}

export const isoFromJdn = (jdn: number) => toISO(fromJdn(jdn))

export function jdnFromISO(value: string) {
  const { year, month, day } = parseISODate(value)
  return toJdn(year, month, day)
}

/** Today's date in Cambodia (or another IANA timezone) as YYYY-MM-DD. */
export function todayISO(timeZone = "Asia/Phnom_Penh") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}
