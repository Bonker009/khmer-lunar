import { MonthIndex, type Lang } from "./constants"
import { findMonth, getLunarYear } from "./core"
import { isoFromJdn, pad } from "./date"
import { getKhmerNewYear } from "./new-year"

export type HolidayType = "public" | "observance"

export interface Holiday {
  id: string
  name: Record<Lang, string>
  type: HolidayType
  /** Whether the date follows the lunar calendar. */
  lunar: boolean
  dates: string[]
}

export interface HolidayOccurrence {
  id: string
  name: Record<Lang, string>
  type: HolidayType
  date: string
}

interface FixedHoliday {
  id: string
  month: number
  day: number
  name: Record<Lang, string>
  type: HolidayType
  since?: number
}

/**
 * Cambodian fixed-date holidays. The Royal Government announces the official
 * list every year, so treat this as a reference, not a legal source.
 */
const FIXED_HOLIDAYS: FixedHoliday[] = [
  { id: "international-new-year", month: 1, day: 1, type: "public", name: { km: "ទិវាចូលឆ្នាំសកល", en: "International New Year's Day" } },
  { id: "victory-over-genocide", month: 1, day: 7, type: "public", name: { km: "ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍", en: "Victory over Genocide Day" } },
  { id: "womens-day", month: 3, day: 8, type: "public", name: { km: "ទិវាអន្តរជាតិនារី", en: "International Women's Day" } },
  { id: "labour-day", month: 5, day: 1, type: "public", name: { km: "ទិវាពលកម្មអន្តរជាតិ", en: "International Labour Day" } },
  { id: "king-birthday", month: 5, day: 14, type: "public", since: 2005, name: { km: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះមហាក្សត្រ", en: "King Norodom Sihamoni's Birthday" } },
  { id: "national-day-of-remembrance", month: 5, day: 20, type: "observance", name: { km: "ទិវាជាតិនៃការចងចាំ", en: "National Day of Remembrance" } },
  { id: "queen-mother-birthday", month: 6, day: 18, type: "public", since: 2015, name: { km: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី ព្រះវររាជមាតា", en: "Queen Mother's Birthday" } },
  { id: "constitution-day", month: 9, day: 24, type: "public", since: 1993, name: { km: "ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ", en: "Constitution Day" } },
  { id: "king-father-commemoration", month: 10, day: 15, type: "public", since: 2013, name: { km: "ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះបរមរតនកោដ្ឋ", en: "Commemoration Day of King Father Norodom Sihanouk" } },
  { id: "coronation-day", month: 10, day: 29, type: "public", since: 2004, name: { km: "ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ", en: "Coronation Day" } },
  { id: "independence-day", month: 11, day: 9, type: "public", since: 1953, name: { km: "ពិធីបុណ្យឯករាជ្យជាតិ", en: "Independence Day" } },
  { id: "human-rights-day", month: 12, day: 10, type: "observance", name: { km: "ទិវាសិទ្ធិមនុស្សអន្តរជាតិ", en: "International Human Rights Day" } },
  { id: "peace-day", month: 12, day: 29, type: "public", since: 2024, name: { km: "ទិវាសន្តិភាពនៅកម្ពុជា", en: "Peace Day in Cambodia" } },
]

interface LunarHoliday {
  id: string
  monthIndex: number
  /** Day offsets from 1 កើត; they may run past the month into the next one. */
  dayNumbers: number[]
  name: Record<Lang, string>
  type: HolidayType
}

const LUNAR_HOLIDAYS: LunarHoliday[] = [
  { id: "meak-bochea", monthIndex: MonthIndex.Meak, dayNumbers: [14], type: "observance", name: { km: "ពិធីបុណ្យមាឃបូជា", en: "Meak Bochea Day" } },
  { id: "visak-bochea", monthIndex: MonthIndex.Pisakh, dayNumbers: [14], type: "public", name: { km: "ពិធីបុណ្យវិសាខបូជា", en: "Visak Bochea Day" } },
  { id: "royal-ploughing", monthIndex: MonthIndex.Pisakh, dayNumbers: [18], type: "public", name: { km: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", en: "Royal Ploughing Ceremony" } },
  // 14 រោច, 15 រោច ភទ្របទ and 1 កើត អស្សុជ
  { id: "pchum-ben", monthIndex: MonthIndex.Phatrabot, dayNumbers: [28, 29, 30], type: "public", name: { km: "ពិធីបុណ្យភ្ជុំបិណ្ឌ", en: "Pchum Ben Festival" } },
  // 14 កើត, 15 កើត and 1 រោច កត្តិក
  { id: "water-festival", monthIndex: MonthIndex.Kadeuk, dayNumbers: [13, 14, 15], type: "public", name: { km: "ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក", en: "Water Festival" } },
]

const cache = new Map<number, Holiday[]>()

export function getHolidays(year: number): Holiday[] {
  const cached = cache.get(year)
  if (cached) return cached

  const lunarYear = getLunarYear(year)
  const holidays: Holiday[] = FIXED_HOLIDAYS.filter((h) => !h.since || year >= h.since).map((h) => ({
    id: h.id,
    name: h.name,
    type: h.type,
    lunar: false,
    dates: [`${pad(year, 4)}-${pad(h.month)}-${pad(h.day)}`],
  }))

  for (const h of LUNAR_HOLIDAYS) {
    const month = findMonth(lunarYear, h.monthIndex)!
    holidays.push({
      id: h.id,
      name: h.name,
      type: h.type,
      lunar: true,
      dates: h.dayNumbers.map((n) => isoFromJdn(month.start + n)),
    })
  }

  const newYear = getKhmerNewYear(year)
  holidays.push({
    id: "khmer-new-year",
    name: { km: "ពិធីបុណ្យចូលឆ្នាំប្រពៃណីជាតិ", en: "Khmer New Year" },
    type: "public",
    lunar: true,
    dates: newYear.schedule.map((d) => d.date),
  })

  holidays.sort((a, b) => a.dates[0].localeCompare(b.dates[0]))
  cache.set(year, holidays)
  return holidays
}

/** Every holiday day in a year, one entry per date. */
export function getHolidayOccurrences(year: number): HolidayOccurrence[] {
  return getHolidays(year)
    .flatMap((h) => h.dates.map((date) => ({ id: h.id, name: h.name, type: h.type, date })))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getHolidaysOn(date: string): HolidayOccurrence[] {
  const year = Number(date.slice(0, 4))
  return getHolidayOccurrences(year).filter((h) => h.date === date)
}
