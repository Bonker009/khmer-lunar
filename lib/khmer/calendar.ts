import { assertYearInRange, daysInGregorianMonth, fromJdn, isoFromJdn, toJdn, weekdayOf } from "./date"
import { getHolidayOccurrences, type HolidayOccurrence } from "./holidays"
import { getLunarDate, type LunarDate } from "./lunar"

export interface CalendarDay {
  date: string
  year: number
  month: number
  day: number
  weekday: number
  inMonth: boolean
  /** null for padding days outside the supported range */
  lunar: LunarDate | null
  holidays: HolidayOccurrence[]
}

export interface MonthCalendar {
  year: number
  month: number
  weekStartsOn: 0 | 1
  weeks: CalendarDay[][]
  /** Lunar months overlapping this Gregorian month, in order */
  lunarMonths: { monthIndex: number; beYear: number }[]
  holidays: HolidayOccurrence[]
  holyDays: string[]
}

export function getMonthCalendar(year: number, month: number, weekStartsOn: 0 | 1 = 0): MonthCalendar {
  assertYearInRange(year)
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("Month must be between 1 and 12")
  }

  const first = toJdn(year, month, 1)
  const length = daysInGregorianMonth(year, month)
  const offset = (weekdayOf(first) - weekStartsOn + 7) % 7
  const cellCount = Math.ceil((offset + length) / 7) * 7
  const gridStart = first - offset

  const holidayCache = new Map<number, HolidayOccurrence[]>()
  const holidaysOn = (date: string, y: number) => {
    if (!holidayCache.has(y)) {
      try {
        holidayCache.set(y, getHolidayOccurrences(y))
      } catch {
        holidayCache.set(y, [])
      }
    }
    return holidayCache.get(y)!.filter((h) => h.date === date)
  }

  const days: CalendarDay[] = []
  for (let i = 0; i < cellCount; i++) {
    const jdn = gridStart + i
    const ymd = fromJdn(jdn)
    const date = isoFromJdn(jdn)
    let lunar: LunarDate | null = null
    try {
      lunar = getLunarDate(jdn)
    } catch {
      lunar = null
    }
    days.push({
      date,
      ...ymd,
      weekday: weekdayOf(jdn),
      inMonth: ymd.month === month,
      lunar,
      holidays: holidaysOn(date, ymd.year),
    })
  }

  const inMonth = days.filter((d) => d.inMonth)
  const lunarMonths: MonthCalendar["lunarMonths"] = []
  for (const d of inMonth) {
    if (!d.lunar) continue
    const last = lunarMonths[lunarMonths.length - 1]
    if (!last || last.monthIndex !== d.lunar.monthIndex) {
      lunarMonths.push({ monthIndex: d.lunar.monthIndex, beYear: d.lunar.beYear })
    }
  }

  const weeks: CalendarDay[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  return {
    year,
    month,
    weekStartsOn,
    weeks,
    lunarMonths,
    holidays: inMonth.flatMap((d) => d.holidays),
    holyDays: inMonth.filter((d) => d.lunar?.holyDay).map((d) => d.date),
  }
}
