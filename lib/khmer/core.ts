import { MAX_YEAR, MIN_YEAR, MonthIndex } from "./constants"
import { toJdn } from "./date"
import { getLeapType, type LeapType } from "./era"

export interface LunarMonthSpan {
  index: number
  /** JDN of 1 កើត */
  start: number
  length: number
}

/**
 * A lunar year runs from 1 កើត បុស្ស to the last day of មិគសិរ. Its
 * leap rules come from the Gregorian year its middle months (ជេស្ឋ/អាសាឍ) fall in.
 */
export interface LunarYearSpan {
  gregorianYear: number
  start: number
  length: number
  leapType: LeapType
  months: LunarMonthSpan[]
}

const M = MonthIndex
const REGULAR_ORDER = [M.Boss, M.Meak, M.Phalkun, M.Cheit, M.Pisakh, M.Jesth, M.Asadh, M.Srap, M.Phatrabot, M.Assoch, M.Kadeuk, M.Migasir]
const LEAP_MONTH_ORDER = [M.Boss, M.Meak, M.Phalkun, M.Cheit, M.Pisakh, M.Jesth, M.Pathamasadh, M.Tutiyasadh, M.Srap, M.Phatrabot, M.Assoch, M.Kadeuk, M.Migasir]

/** Epoch: 1 January 1900 is 1 កើត ខែបុស្ស. */
const EPOCH_JDN = toJdn(MIN_YEAR, 1, 1)
/** Spans extend past MAX_YEAR so lookups at the end of the range still work. */
const LAST_SPAN_YEAR = MAX_YEAR + 2

export function monthLength(index: number, leapType: LeapType) {
  if (index === M.Jesth) return leapType === "leap-day" ? 30 : 29
  if (index === M.Pathamasadh || index === M.Tutiyasadh) return 30
  return index % 2 === 0 ? 29 : 30
}

let spans: LunarYearSpan[] | undefined

function getSpans() {
  if (spans) return spans
  const list: LunarYearSpan[] = []
  let start = EPOCH_JDN
  for (let year = MIN_YEAR; year <= LAST_SPAN_YEAR; year++) {
    const leapType = getLeapType(year + 544)
    const order = leapType === "leap-month" ? LEAP_MONTH_ORDER : REGULAR_ORDER
    let cursor = start
    const months = order.map((index) => {
      const length = monthLength(index, leapType)
      const month = { index, start: cursor, length }
      cursor += length
      return month
    })
    list.push({ gregorianYear: year, start, length: cursor - start, leapType, months })
    start = cursor
  }
  spans = list
  return list
}

export function getLunarYear(gregorianYear: number): LunarYearSpan {
  const span = getSpans()[gregorianYear - MIN_YEAR]
  if (!span) {
    throw new RangeError(`Lunar year for ${gregorianYear} is outside the supported range`)
  }
  return span
}

export function findLunarYear(jdn: number): LunarYearSpan {
  const list = getSpans()
  const last = list[list.length - 1]
  if (jdn < list[0].start || jdn >= last.start + last.length) {
    throw new RangeError("Date is outside the supported range")
  }
  let lo = 0
  let hi = list.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (list[mid].start <= jdn) lo = mid
    else hi = mid - 1
  }
  return list[lo]
}

export function findMonth(year: LunarYearSpan, index: number) {
  return year.months.find((month) => month.index === index)
}

export interface LunarCore {
  year: LunarYearSpan
  month: LunarMonthSpan
  /** 0–29: 0–14 are 1–15 កើត, 15–29 are 1–15 រោច */
  dayNumber: number
}

export function lunarCore(jdn: number): LunarCore {
  const year = findLunarYear(jdn)
  const month = year.months.find((m) => jdn < m.start + m.length)!
  return { year, month, dayNumber: jdn - month.start }
}
