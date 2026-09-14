import type { NextRequest } from "next/server"
import { getLang, requireYear } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import {
  buddhistEraStartJdn,
  getAharkun,
  getAvoman,
  getBodithey,
  getKhmerNewYear,
  getKromthupul,
  getLunarYear,
  isKhmerSolarLeap,
  isoFromJdn,
  LEAP_TYPES,
  LUNAR_MONTHS,
} from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const year = requireYear(params)
    const beYear = year + 544
    const lunarYear = getLunarYear(year)

    return ok({
      gregorianYear: year,
      buddhistEra: beYear,
      jolakSakaraj: beYear - 1182,
      aharkun: getAharkun(beYear),
      kromthupul: getKromthupul(beYear),
      avoman: getAvoman(beYear),
      bodithey: getBodithey(beYear),
      isSolarLeapYear: isKhmerSolarLeap(beYear),
      leapType: lunarYear.leapType,
      leapTypeName: LEAP_TYPES[lang][lunarYear.leapType],
      daysInLunarYear: lunarYear.length,
      lunarYearStart: isoFromJdn(lunarYear.start),
      buddhistEraStart: isoFromJdn(buddhistEraStartJdn(year)),
      khmerNewYear: getKhmerNewYear(year).date,
      months: lunarYear.months.map((m) => ({
        index: m.index,
        name: LUNAR_MONTHS[lang][m.index],
        days: m.length,
        start: isoFromJdn(m.start),
        end: isoFromJdn(m.start + m.length - 1),
      })),
    })
  })
}

export const OPTIONS = preflight
