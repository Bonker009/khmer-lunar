import { GREGORIAN_MONTHS, type Lang } from "@/lib/khmer/constants"
import { toKhmerNumber } from "@/lib/khmer/numerals"

/** Search titles and descriptions. Kept separate from UI strings. */

export interface PageCopy {
  title: string
  description: string
}

type Page = "home" | "calendar" | "convert" | "count" | "holidays" | "docs"

const COPY: Record<Page, Record<Lang, PageCopy>> = {
  home: {
    km: {
      title: "ប្រតិទិនខ្មែរថ្ងៃនេះ – ថ្ងៃខែចន្ទគតិ ថ្ងៃសីល និងថ្ងៃបុណ្យ",
      description:
        "មើលថ្ងៃខែចន្ទគតិខ្មែរថ្ងៃនេះ ពុទ្ធសករាជ ឆ្នាំសត្វ ស័ក ថ្ងៃសីល ថ្ងៃបុណ្យ និងពេលវេលាចូលឆ្នាំខ្មែរ។ បំប្លែងកាលបរិច្ឆេទ រាប់ថ្ងៃ និង API ឥតគិតថ្លៃ។",
    },
    en: {
      title: "Khmer Lunar Calendar Today – Lunar Date, Holy Days & Holidays",
      description:
        "Today's Khmer lunar date with Buddhist Era, animal year, Buddhist holy days, Cambodian public holidays and the exact Khmer New Year time. Free converter, day counter and API.",
    },
  },
  calendar: {
    km: {
      title: "ប្រតិទិនខ្មែរប្រចាំខែ – ចន្ទគតិ ថ្ងៃសីល និងថ្ងៃបុណ្យ",
      description:
        "ប្រតិទិនសុរិយគតិ និងចន្ទគតិខ្មែរប្រចាំខែ បង្ហាញថ្ងៃកើត រោច ថ្ងៃសីល ពេញបូណ៌មី និងថ្ងៃឈប់សម្រាកនៅកម្ពុជា។",
    },
    en: {
      title: "Khmer Monthly Calendar – Lunar Dates, Holy Days & Holidays",
      description:
        "Monthly Gregorian and Khmer lunar calendar with waxing and waning days, Buddhist holy days, full moons and Cambodian public holidays.",
    },
  },
  convert: {
    km: {
      title: "បំប្លែងថ្ងៃខែ សុរិយគតិ ⇄ ចន្ទគតិខ្មែរ",
      description:
        "បំប្លែងកាលបរិច្ឆេទពីសុរិយគតិទៅចន្ទគតិខ្មែរ និងពីចន្ទគតិទៅសុរិយគតិ ជាមួយពុទ្ធសករាជ ឆ្នាំសត្វ និងស័ក ចាប់ពីឆ្នាំ ១៩០០ ដល់ ២១០០។",
    },
    en: {
      title: "Khmer Lunar Date Converter – Gregorian ⇄ Khmer Calendar",
      description:
        "Convert any date between the Gregorian and Khmer lunar calendars, with Buddhist Era, animal year and sak, from 1900 to 2100.",
    },
  },
  count: {
    km: {
      title: "រាប់ថ្ងៃ ថ្ងៃធ្វើការ និងថ្ងៃឈប់សម្រាកនៅកម្ពុជា",
      description:
        "រាប់ចំនួនថ្ងៃរវាងកាលបរិច្ឆេទពីរ ដោយរាប់ ឬមិនរាប់ចុងសប្តាហ៍ និងថ្ងៃឈប់សម្រាក បូកថ្ងៃ និងមើលថ្ងៃបុណ្យខាងមុខ។",
    },
    en: {
      title: "Cambodia Day Counter – Working Days, Weekends & Holidays",
      description:
        "Count the days between two dates in Cambodia, including or excluding weekends and public holidays. Add days to a date and see upcoming festivals.",
    },
  },
  holidays: {
    km: {
      title: "ថ្ងៃបុណ្យ និងថ្ងៃឈប់សម្រាកកម្ពុជា – ចូលឆ្នាំខ្មែរ",
      description:
        "បញ្ជីថ្ងៃឈប់សម្រាក និងថ្ងៃបុណ្យនៅកម្ពុជា រួមមានបុណ្យចូលឆ្នាំខ្មែរ វិសាខបូជា ភ្ជុំបិណ្ឌ និងបុណ្យអុំទូក ព្រមទាំងពេលវេលាទេវតាចុះ។",
    },
    en: {
      title: "Cambodia Public Holidays – Khmer New Year, Pchum Ben & Water Festival",
      description:
        "Cambodian public holidays and Buddhist festivals: Khmer New Year with the exact arrival time, Visak Bochea, Pchum Ben, Water Festival and more.",
    },
  },
  docs: {
    km: {
      title: "API ប្រតិទិនចន្ទគតិខ្មែរ ឥតគិតថ្លៃ",
      description:
        "REST API ឥតគិតថ្លៃសម្រាប់បំប្លែងកាលបរិច្ឆេទចន្ទគតិខ្មែរ ប្រតិទិនប្រចាំខែ ថ្ងៃបុណ្យ ចូលឆ្នាំខ្មែរ និងរាប់ថ្ងៃ។ ចម្លើយតបជា JSON និងគាំទ្រ CORS។",
    },
    en: {
      title: "Khmer Lunar Calendar API – Free JSON API for Developers",
      description:
        "Free REST API for Khmer lunar date conversion, monthly calendars, Cambodian holidays, Khmer New Year and day counting. JSON responses with CORS.",
    },
  },
}

export function seoCopy(page: Page, lang: Lang): PageCopy {
  return COPY[page][lang]
}

/** Khmer numerals with the Latin year in brackets, since people search with both. */
const khmerYear = (year: number) => `${toKhmerNumber(year)} (${year})`

export function calendarMonthCopy(year: number, month: number, lang: Lang): PageCopy {
  const name = GREGORIAN_MONTHS[lang][month - 1]
  if (lang === "km") {
    return {
      title: `ប្រតិទិនខ្មែរ ខែ${name} ឆ្នាំ${khmerYear(year)}`,
      description: `ប្រតិទិនចន្ទគតិខ្មែរ ខែ${name} ឆ្នាំ${toKhmerNumber(year)}៖ ថ្ងៃកើត រោច ថ្ងៃសីល ពេញបូណ៌មី និងថ្ងៃបុណ្យនៅកម្ពុជាគ្រប់ថ្ងៃ។`,
    }
  }
  return {
    title: `Khmer Lunar Calendar ${name} ${year}`,
    description: `Khmer lunar dates for every day of ${name} ${year}, with Buddhist holy days, full and new moons and Cambodian public holidays.`,
  }
}

export function holidaysYearCopy(year: number, lang: Lang): PageCopy {
  if (lang === "km") {
    return {
      title: `ថ្ងៃបុណ្យ និងថ្ងៃឈប់សម្រាកកម្ពុជា ឆ្នាំ${khmerYear(year)}`,
      description: `ថ្ងៃឈប់សម្រាក និងថ្ងៃបុណ្យនៅកម្ពុជា ឆ្នាំ${toKhmerNumber(year)}៖ ចូលឆ្នាំខ្មែរ (ពេលវេលាទេវតាចុះ) វិសាខបូជា ច្រត់ព្រះនង្គ័ល ភ្ជុំបិណ្ឌ និងបុណ្យអុំទូក។`,
    }
  }
  return {
    title: `Cambodia Public Holidays ${year} – Khmer New Year & Festivals`,
    description: `All Cambodian public holidays and Buddhist festivals in ${year}: Khmer New Year with the exact arrival time, Visak Bochea, Royal Ploughing, Pchum Ben and Water Festival.`,
  }
}

export const KEYWORDS: Record<Lang, string[]> = {
  km: ["ប្រតិទិនខ្មែរ", "ចន្ទគតិ", "ថ្ងៃសីល", "ថ្ងៃបុណ្យ", "ចូលឆ្នាំខ្មែរ", "ពុទ្ធសករាជ", "ថ្ងៃឈប់សម្រាក"],
  en: ["Khmer calendar", "Khmer lunar calendar", "Cambodia public holidays", "Khmer New Year", "Buddhist holy days", "Chhankitek"],
}
