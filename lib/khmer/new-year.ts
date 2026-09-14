import { lunarCore } from "./core"
import { isoFromJdn, pad, toJdn } from "./date"

/**
 * Khmer New Year (មហាសង្ក្រាន្ត) from the Sotin / Lerng Sak computation.
 * These formulas take the Jolak Sakaraj (JS) year.
 */

function getAharkunJs(jsYear: number) {
  return Math.floor((jsYear * 292207 + 373) / 800) + 1
}

function getAvomanJs(jsYear: number) {
  return (getAharkunJs(jsYear) * 11 + 650) % 692
}

function getKromthupulJs(jsYear: number) {
  return 800 - ((292207 * jsYear + 373) % 800)
}

function getBoditheyJs(jsYear: number) {
  const aharkun = getAharkunJs(jsYear)
  return (aharkun + Math.floor((11 * aharkun + 650) / 692)) % 30
}

function isAdhikameas(jsYear: number) {
  const bodithey = getBoditheyJs(jsYear)
  const next = getBoditheyJs(jsYear + 1)
  if (bodithey === 24 && next === 6) return true
  if (bodithey === 25 && next === 5) return false
  return bodithey > 24 || bodithey < 6
}

function isChantrathimeas(jsYear: number) {
  const avoman = getAvomanJs(jsYear)
  const isSolarLeap = getKromthupulJs(jsYear) <= 207
  if (avoman === 0 && getAvomanJs(jsYear - 1) === 137) return true
  if (isSolarLeap) return avoman < 127
  if (avoman === 137 && getAvomanJs(jsYear + 1) === 0) return false
  return avoman < 138
}

interface SunInfo {
  angsar: number
  libda: number
}

/** Position of the sun (រាសី / អង្សា / លិប្ដា) on a given sotin. */
function getSunInfo(jsYear: number, sotin: number): SunInfo {
  const r2 = 800 * sotin + getKromthupulJs(jsYear - 1)
  const reasey = Math.floor(r2 / 24350)
  const r3 = r2 % 24350
  const angsar = Math.floor(r3 / 811)
  const libda = Math.floor((r3 % 811) / 14) - 3
  const sunAverage = 30 * 60 * reasey + 60 * angsar + libda

  const s1 = 30 * 60 * 2 + 60 * 20
  let leftOver = sunAverage - s1
  if (sunAverage < s1) leftOver += 30 * 60 * 12
  const kaen = Math.floor(leftOver / (30 * 60))

  let rs = -1
  if (kaen <= 2) rs = kaen
  else if (kaen <= 5) rs = 30 * 60 * 6 - leftOver
  else if (kaen <= 8) rs = leftOver - 30 * 60 * 6
  else rs = 30 * 60 * 11 + 60 * 29 + 60 - leftOver

  const last = {
    reasey: Math.floor(rs / (30 * 60)),
    angsar: Math.floor((rs % (30 * 60)) / 60),
    libda: rs % 60,
  }

  const khan = last.angsar >= 15 ? 2 * last.reasey + 1 : 2 * last.reasey
  const pouichalip =
    last.angsar >= 15 ? 60 * (last.angsar - 15) + last.libda : 60 * last.angsar + last.libda

  const chhayaSunMap = [
    { multiplicity: 35, chhaya: 0 },
    { multiplicity: 32, chhaya: 35 },
    { multiplicity: 27, chhaya: 67 },
    { multiplicity: 22, chhaya: 94 },
    { multiplicity: 13, chhaya: 116 },
    { multiplicity: 5, chhaya: 129 },
  ]
  const chhaya = khan <= 5 ? chhayaSunMap[khan] : { multiplicity: 0, chhaya: 134 }
  const phol = Math.floor((pouichalip * chhaya.multiplicity) / 900) + chhaya.chhaya
  const inauguration = kaen <= 5 ? sunAverage - phol : sunAverage + phol

  return {
    angsar: Math.floor((inauguration % (30 * 60)) / 60),
    libda: inauguration % 60,
  }
}

/** Known published New Year moments that differ from the computation. */
const EXCEPTIONS: Record<number, [month: number, day: number, hour: number, minute: number]> = {
  2011: [4, 14, 13, 12],
  2012: [4, 14, 19, 11],
  2013: [4, 14, 2, 12],
  2014: [4, 14, 8, 7],
  2015: [4, 14, 14, 2],
  2024: [4, 13, 22, 17],
}

export type NewYearDayKind = "moha-songkran" | "vanabat" | "lerng-sak"

export interface KhmerNewYear {
  year: number
  /** Day the new Tevada arrives (មហាសង្ក្រាន្ត) */
  date: string
  jdn: number
  /** Local time (Cambodia) of arrival, HH:MM */
  time: string
  hour: number
  minute: number
  /** Celebration length: 3 or 4 days */
  days: number
  vanabatDays: number
  lerngSakDate: string
  lerngSakJdn: number
  schedule: { date: string; kind: NewYearDayKind }[]
}

const cache = new Map<number, KhmerNewYear>()

export function getKhmerNewYear(year: number): KhmerNewYear {
  const cached = cache.get(year)
  if (cached) return cached

  const jsYear = year - 638
  const sotins = getKromthupulJs(jsYear - 1) <= 207 ? [363, 364, 365, 366] : [362, 363, 364, 365]
  const sunInfos = sotins.map((sotin) => getSunInfo(jsYear, sotin))

  let hour = 0
  let minute = 0
  const arrival = sunInfos.find((info) => info.angsar === 0)
  if (arrival) {
    const minutes = 24 * 60 - arrival.libda * 24
    hour = Math.floor(minutes / 60) % 24
    minute = minutes % 60
  }

  let bodithey = getBoditheyJs(jsYear)
  if (isAdhikameas(jsYear - 1) && isChantrathimeas(jsYear - 1)) {
    bodithey = (bodithey + 1) % 30
  }
  const lerngSakDay = bodithey >= 6 ? bodithey - 1 : bodithey
  const lerngSakMonth = bodithey >= 6 ? 4 : 5 // ចេត្រ or ពិសាខ

  const days = sunInfos[0].angsar === 0 ? 4 : 3

  // Work backwards from 17 April to the lunar day of Lerng Sak.
  const epochJdn = toJdn(year, 4, 17)
  const epoch = lunarCore(epochJdn)
  const diff =
    (epoch.month.index - 4) * 29 + epoch.dayNumber - ((lerngSakMonth - 4) * 29 + lerngSakDay)
  let jdn = epochJdn - (diff + days - 1)

  const exception = EXCEPTIONS[year]
  if (exception) {
    jdn = toJdn(year, exception[0], exception[1])
    hour = exception[2]
    minute = exception[3]
  }

  const lerngSakJdn = jdn + days - 1
  const schedule = Array.from({ length: days }, (_, i) => ({
    date: isoFromJdn(jdn + i),
    kind: (i === 0 ? "moha-songkran" : i === days - 1 ? "lerng-sak" : "vanabat") as NewYearDayKind,
  }))

  const result: KhmerNewYear = {
    year,
    date: isoFromJdn(jdn),
    jdn,
    time: `${pad(hour)}:${pad(minute)}`,
    hour,
    minute,
    days,
    vanabatDays: days - 2,
    lerngSakDate: isoFromJdn(lerngSakJdn),
    lerngSakJdn,
    schedule,
  }
  cache.set(year, result)
  return result
}
