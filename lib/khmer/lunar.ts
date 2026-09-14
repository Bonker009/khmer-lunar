import { MonthIndex } from "./constants"
import { findMonth, getLunarYear, lunarCore } from "./core"
import { assertYearInRange, fromJdn, isoFromJdn, jdnFromISO, weekdayOf } from "./date"
import type { LeapType } from "./era"
import { getKhmerNewYear } from "./new-year"

export type Phase = "kert" | "roech"
export type HolyDayKind = "8-kert" | "15-kert" | "8-roech" | "last-roech"
export type MoonPhaseKind = "first-quarter" | "full" | "last-quarter" | "new"

export interface LunarDate {
  jdn: number
  /** Gregorian date, YYYY-MM-DD */
  date: string
  year: number
  month: number
  day: number
  /** 0 = Sunday */
  weekday: number
  /** 1–15 */
  lunarDay: number
  phase: Phase
  /** 0–29 within the lunar month */
  dayNumber: number
  monthIndex: number
  monthLength: number
  leapType: LeapType
  /** ពុទ្ធសករាជ: changes on 1 រោច ពិសាខ */
  beYear: number
  /** ចុល្លសករាជ: changes on ឡើងស័ក */
  jsYear: number
  /** 0 = ជូត (Rat); changes at មហាសង្ក្រាន្ត */
  animalYear: number
  /** 0 = សំរឹទ្ធិស័ក */
  sak: number
  holyDay: HolyDayKind | null
  moonPhase: MoonPhaseKind | null
}

export function holyDayOf(dayNumber: number, monthLength: number): HolyDayKind | null {
  if (dayNumber === 7) return "8-kert"
  if (dayNumber === 14) return "15-kert"
  if (dayNumber === 22) return "8-roech"
  if (dayNumber === monthLength - 1) return "last-roech"
  return null
}

export function moonPhaseOf(dayNumber: number, monthLength: number): MoonPhaseKind | null {
  if (dayNumber === 7) return "first-quarter"
  if (dayNumber === 14) return "full"
  if (dayNumber === 22) return "last-quarter"
  if (dayNumber === monthLength - 1) return "new"
  return null
}

/** JDN of 1 រោច ពិសាខ in a Gregorian year, the day the Buddhist Era increments. */
export function buddhistEraStartJdn(gregorianYear: number) {
  return findMonth(getLunarYear(gregorianYear), MonthIndex.Pisakh)!.start + 15
}

export function getLunarDate(input: string | number): LunarDate {
  const jdn = typeof input === "string" ? jdnFromISO(input) : input
  const { year, month, day } = fromJdn(jdn)
  assertYearInRange(year)

  const core = lunarCore(jdn)
  const beStart = buddhistEraStartJdn(year)
  const newYear = getKhmerNewYear(year)
  const beforeBeChange = jdn < beStart

  const beYear = beforeBeChange ? year + 543 : year + 544
  let animalYear = (beYear + 4) % 12
  let jsYear = beYear - 1182
  // Between New Year and Visak Bochea the animal year and era have already
  // moved on while the BE year hasn't.
  if (beforeBeChange && jdn >= newYear.jdn) animalYear = (animalYear + 1) % 12
  if (beforeBeChange && jdn >= newYear.lerngSakJdn) jsYear += 1

  const { dayNumber } = core
  const length = core.month.length
  return {
    jdn,
    date: isoFromJdn(jdn),
    year,
    month,
    day,
    weekday: weekdayOf(jdn),
    lunarDay: dayNumber < 15 ? dayNumber + 1 : dayNumber - 14,
    phase: dayNumber < 15 ? "kert" : "roech",
    dayNumber,
    monthIndex: core.month.index,
    monthLength: length,
    leapType: core.year.leapType,
    beYear,
    jsYear,
    animalYear,
    sak: ((jsYear % 10) + 10) % 10,
    holyDay: holyDayOf(dayNumber, length),
    moonPhase: moonPhaseOf(dayNumber, length),
  }
}

export interface KhmerDateInput {
  beYear: number
  monthIndex: number
  /** 1–15 */
  day: number
  phase: Phase
}

export function khmerToGregorian({ beYear, monthIndex, day, phase }: KhmerDateInput): LunarDate {
  if (!Number.isInteger(day) || day < 1 || day > 15) {
    throw new RangeError("Lunar day must be between 1 and 15")
  }
  if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 13) {
    throw new RangeError("Month index must be between 0 and 13")
  }
  if (phase !== "kert" && phase !== "roech") {
    throw new RangeError("Phase must be `kert` or `roech`")
  }

  // BE year N starts on 1 រោច ពិសាខ of Gregorian year N − 544, so its
  // បុស្ស … 15 កើត ពិសាខ fall in the following lunar year.
  const gregorianYear = beYear - 544
  const inFollowingYear =
    (monthIndex >= MonthIndex.Boss && monthIndex <= MonthIndex.Cheit) ||
    (monthIndex === MonthIndex.Pisakh && phase === "kert")
  const lunarYear = getLunarYear(inFollowingYear ? gregorianYear + 1 : gregorianYear)

  const month = findMonth(lunarYear, monthIndex)
  if (!month) {
    throw new RangeError(
      monthIndex >= MonthIndex.Pathamasadh
        ? `BE ${beYear} has no leap month; use month 7 (Asadh)`
        : `BE ${beYear} has a leap month; use 12 (Pathamasadh) or 13 (Tutiyasadh) instead of 7`
    )
  }

  const dayNumber = phase === "kert" ? day - 1 : day + 14
  if (dayNumber >= month.length) {
    throw new RangeError(`This month has ${month.length} days, so it ends on ${month.length - 15} រោច`)
  }
  return getLunarDate(month.start + dayNumber)
}
