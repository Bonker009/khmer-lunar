/**
 * Yearly astronomical values of the traditional Khmer calendar (Chhankitek).
 * These functions take a Buddhist Era year, following the rules used by
 * momentkh / khmer_calendar.cpp.
 */

export type LeapType = "regular" | "leap-month" | "leap-day"

/** អាហារគុណ: days elapsed since the start of the era. */
export function getAharkun(beYear: number) {
  return Math.floor((beYear * 292207 + 499) / 800) + 4
}

/** ក្រមធុពល */
export function getKromthupul(beYear: number) {
  return 800 - ((beYear * 292207 + 499) % 800)
}

/** អវមាន: tracks the drift between solar and lunar days (0–691). */
export function getAvoman(beYear: number) {
  return (getAharkun(beYear) * 11 + 25) % 692
}

/** បូតិថី: the lunar day on which the year starts (0–29). */
export function getBodithey(beYear: number) {
  const aharkun = getAharkun(beYear)
  return (Math.floor((aharkun * 11 + 25) / 692) + aharkun + 29) % 30
}

/** Solar year of 366 days. */
export function isKhmerSolarLeap(beYear: number) {
  return getKromthupul(beYear) <= 207
}

function hasLeapDayByCalculation(beYear: number) {
  const avoman = getAvoman(beYear)
  if (avoman === 0 && getAvoman(beYear - 1) === 137) return true
  if (isKhmerSolarLeap(beYear)) return avoman < 127
  if (avoman === 137 && getAvoman(beYear + 1) === 0) return false
  return avoman < 138
}

function hasLeapMonth(beYear: number) {
  const bodithey = getBodithey(beYear)
  const next = getBodithey(beYear + 1)
  if (bodithey === 25 && next === 5) return false
  return (bodithey === 24 && next === 6) || bodithey >= 25 || bodithey < 6
}

const leapTypeCache = new Map<number, LeapType>()

/**
 * A year can't have both a leap month and a leap day. When both fall
 * together, the leap day is pushed to the next year that isn't a leap-month year.
 */
export function getLeapType(beYear: number): LeapType {
  const cached = leapTypeCache.get(beYear)
  if (cached) return cached

  let result: LeapType = "regular"
  if (hasLeapMonth(beYear)) {
    result = "leap-month"
  } else if (hasLeapDayByCalculation(beYear)) {
    result = "leap-day"
  } else if (hasLeapMonth(beYear - 1)) {
    let previous = beYear - 1
    while (true) {
      if (hasLeapDayByCalculation(previous)) {
        result = "leap-day"
        break
      }
      previous -= 1
      if (!hasLeapMonth(previous)) break
    }
  }

  leapTypeCache.set(beYear, result)
  return result
}

export function daysInLunarYear(leapType: LeapType) {
  if (leapType === "leap-month") return 384
  if (leapType === "leap-day") return 355
  return 354
}
