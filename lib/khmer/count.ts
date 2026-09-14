import { HOLY_DAY_NAME, MOON_PHASES, type Lang } from "./constants"
import { lunarCore } from "./core"
import {
  daysInGregorianMonth,
  fromJdn,
  isGregorianLeapYear,
  isoFromJdn,
  jdnFromISO,
  toJdn,
  weekdayOf,
  type YMD,
} from "./date"
import { getHolidayOccurrences, getHolidays, type HolidayOccurrence } from "./holidays"
import { buddhistEraStartJdn, getLunarDate, holyDayOf, type LunarDate } from "./lunar"
import { getKhmerNewYear } from "./new-year"

function calendarDiff(a: YMD, b: YMD) {
  let years = b.year - a.year
  let months = b.month - a.month
  let days = b.day - a.day
  if (days < 0) {
    months -= 1
    const prevMonth = b.month === 1 ? 12 : b.month - 1
    const prevYear = b.month === 1 ? b.year - 1 : b.year
    days += daysInGregorianMonth(prevYear, prevMonth)
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

export interface CountOptions {
  /** Count the end date as well. Default false: the range is [from, to). */
  includeEnd?: boolean
  /** Leave weekend days out of `countedDays`. */
  excludeWeekends?: boolean
  /** Leave public holidays out of `countedDays` (observances are never days off). */
  excludeHolidays?: boolean
  /** Weekend weekdays, 0 = Sunday. Default Saturday and Sunday. */
  weekend?: number[]
}

export interface DaysBetween {
  from: string
  to: string
  /** Signed calendar difference: negative when `to` is before `from`. */
  days: number
  absoluteDays: number
  weeks: number
  remainingDays: number
  calendar: { years: number; months: number; days: number }
  options: Required<CountOptions>
  /** Days in the counted range. The counts below all cover this range. */
  totalDays: number
  /** `totalDays` minus the excluded weekend days and public holidays. */
  countedDays: number
  /** Days that are neither weekend nor public holiday. */
  workingDays: number
  weekendDays: number
  /** Distinct public-holiday dates, including those that fall on a weekend. */
  holidayDays: number
  holidaysOnWeekend: number
  holyDays: number
  newLunarMonths: number
  holidays: HolidayOccurrence[]
}

export function daysBetween(from: string, to: string, options: CountOptions = {}): DaysBetween {
  const resolved: Required<CountOptions> = {
    includeEnd: options.includeEnd ?? false,
    excludeWeekends: options.excludeWeekends ?? false,
    excludeHolidays: options.excludeHolidays ?? false,
    weekend: options.weekend ?? [0, 6],
  }
  const a = jdnFromISO(from)
  const b = jdnFromISO(to)
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  const end = resolved.includeEnd ? hi + 1 : hi
  const absoluteDays = hi - lo

  const loIso = isoFromJdn(lo)
  const endIso = isoFromJdn(end)
  const holidays: HolidayOccurrence[] = []
  const publicHolidayDates = new Set<string>()
  for (let year = fromJdn(lo).year; year <= fromJdn(hi).year; year++) {
    for (const h of getHolidayOccurrences(year)) {
      if (h.date < loIso || h.date >= endIso) continue
      holidays.push(h)
      if (h.type === "public") publicHolidayDates.add(h.date)
    }
  }

  const weekendSet = new Set(resolved.weekend)
  let weekendDays = 0
  let holidayDays = 0
  let holidaysOnWeekend = 0
  let holyDays = 0
  let newLunarMonths = 0
  for (let jdn = lo; jdn < end; jdn++) {
    const isWeekend = weekendSet.has(weekdayOf(jdn))
    const isHoliday = publicHolidayDates.has(isoFromJdn(jdn))
    if (isWeekend) weekendDays += 1
    if (isHoliday) holidayDays += 1
    if (isWeekend && isHoliday) holidaysOnWeekend += 1
    const { dayNumber, month } = lunarCore(jdn)
    if (holyDayOf(dayNumber, month.length)) holyDays += 1
    if (dayNumber === 0) newLunarMonths += 1
  }

  const totalDays = end - lo
  const excludedWeekends = resolved.excludeWeekends ? weekendDays : 0
  // A holiday on a weekend is only removed once.
  const excludedHolidays = resolved.excludeHolidays
    ? holidayDays - (resolved.excludeWeekends ? holidaysOnWeekend : 0)
    : 0

  return {
    from,
    to,
    days: b - a,
    absoluteDays,
    weeks: Math.floor(absoluteDays / 7),
    remainingDays: absoluteDays % 7,
    calendar: calendarDiff(fromJdn(lo), fromJdn(hi)),
    options: resolved,
    totalDays,
    countedDays: totalDays - excludedWeekends - excludedHolidays,
    workingDays: totalDays - weekendDays - (holidayDays - holidaysOnWeekend),
    weekendDays,
    holidayDays,
    holidaysOnWeekend,
    holyDays,
    newLunarMonths,
    holidays,
  }
}

export interface CountdownEvent {
  id: string
  name: Record<Lang, string>
  date: string
  daysUntil: number
}

/** Index into a holiday's `dates` for its main day. */
const COUNTDOWN_HOLIDAYS: Record<string, number> = {
  "international-new-year": 0,
  "meak-bochea": 0,
  "khmer-new-year": 0,
  "visak-bochea": 0,
  "royal-ploughing": 0,
  "pchum-ben": 1,
  "water-festival": 1,
}

export function countdown(from: string): CountdownEvent[] {
  const start = jdnFromISO(from)
  const year = fromJdn(start).year
  const events: CountdownEvent[] = []

  for (const [id, mainDay] of Object.entries(COUNTDOWN_HOLIDAYS)) {
    for (const y of [year, year + 1]) {
      const holiday = getHolidays(y).find((h) => h.id === id)
      const date = holiday?.dates[mainDay]
      if (holiday && date && date >= from) {
        events.push({ id, name: holiday.name, date, daysUntil: jdnFromISO(date) - start })
        break
      }
    }
  }

  const found = new Set<string>()
  for (let jdn = start; jdn < start + 31 && found.size < 3; jdn++) {
    const { dayNumber, month } = lunarCore(jdn)
    const holy = holyDayOf(dayNumber, month.length)
    const add = (id: string, name: Record<Lang, string>) => {
      if (found.has(id)) return
      found.add(id)
      events.push({ id, name, date: isoFromJdn(jdn), daysUntil: jdn - start })
    }
    if (holy) add("holy-day", HOLY_DAY_NAME)
    if (dayNumber === 14) add("full-moon", { km: MOON_PHASES.km.full, en: MOON_PHASES.en.full })
    if (dayNumber === month.length - 1) add("new-moon", { km: MOON_PHASES.km.new, en: MOON_PHASES.en.new })
  }

  return events.sort((a, b) => a.daysUntil - b.daysUntil)
}

export function addDays(date: string, days: number): LunarDate {
  return getLunarDate(jdnFromISO(date) + days)
}

export interface DayOfYear {
  date: string
  gregorian: { dayOfYear: number; daysInYear: number; daysLeft: number }
  lunarYear: { dayOfYear: number; daysInYear: number; startsOn: string }
  /** Days since the most recent មហាសង្ក្រាន្ត (day 1 is New Year's day). */
  sinceKhmerNewYear: { day: number; newYearDate: string } | null
  /** Days since the BE year began (1 រោច ពិសាខ). */
  sinceBuddhistEraStart: { day: number; startDate: string } | null
}

export function dayOfYear(date: string): DayOfYear {
  const jdn = jdnFromISO(date)
  const { year } = fromJdn(jdn)
  const daysInYear = isGregorianLeapYear(year) ? 366 : 365
  const gregorianDay = jdn - toJdn(year, 1, 1) + 1
  const core = lunarCore(jdn)

  let sinceKhmerNewYear: DayOfYear["sinceKhmerNewYear"] = null
  let sinceBuddhistEraStart: DayOfYear["sinceBuddhistEraStart"] = null
  try {
    const ny = getKhmerNewYear(year).jdn <= jdn ? getKhmerNewYear(year) : getKhmerNewYear(year - 1)
    sinceKhmerNewYear = { day: jdn - ny.jdn + 1, newYearDate: ny.date }
  } catch {
    // before the first supported New Year
  }
  try {
    const thisYear = buddhistEraStartJdn(year)
    const beStart = thisYear <= jdn ? thisYear : buddhistEraStartJdn(year - 1)
    sinceBuddhistEraStart = { day: jdn - beStart + 1, startDate: isoFromJdn(beStart) }
  } catch {
    // before the first supported BE change
  }

  return {
    date,
    gregorian: { dayOfYear: gregorianDay, daysInYear, daysLeft: daysInYear - gregorianDay },
    lunarYear: {
      dayOfYear: jdn - core.year.start + 1,
      daysInYear: core.year.length,
      startsOn: isoFromJdn(core.year.start),
    },
    sinceKhmerNewYear,
    sinceBuddhistEraStart,
  }
}
