export type Lang = "km" | "en"

/** Supported Gregorian year range for every calculation. */
export const MIN_YEAR = 1900
export const MAX_YEAR = 2100

export const MonthIndex = {
  Migasir: 0,
  Boss: 1,
  Meak: 2,
  Phalkun: 3,
  Cheit: 4,
  Pisakh: 5,
  Jesth: 6,
  Asadh: 7,
  Srap: 8,
  Phatrabot: 9,
  Assoch: 10,
  Kadeuk: 11,
  /** First Asadh, only in leap-month (អធិកមាស) years. */
  Pathamasadh: 12,
  /** Second Asadh, only in leap-month (អធិកមាស) years. */
  Tutiyasadh: 13,
} as const

export const LUNAR_MONTHS: Record<Lang, string[]> = {
  km: [
    "មិគសិរ", "បុស្ស", "មាឃ", "ផល្គុន", "ចេត្រ", "ពិសាខ", "ជេស្ឋ",
    "អាសាឍ", "ស្រាពណ៍", "ភទ្របទ", "អស្សុជ", "កត្តិក", "បឋមាសាឍ", "ទុតិយាសាឍ",
  ],
  en: [
    "Migasir", "Boss", "Meak", "Phalkun", "Cheit", "Pisakh", "Jesth",
    "Asadh", "Srap", "Phatrabot", "Assoch", "Kadeuk", "Pathamasadh", "Tutiyasadh",
  ],
}

export const GREGORIAN_MONTHS: Record<Lang, string[]> = {
  km: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
}

export const ANIMAL_YEARS: Record<Lang, string[]> = {
  km: ["ជូត", "ឆ្លូវ", "ខាល", "ថោះ", "រោង", "ម្សាញ់", "មមី", "មមែ", "វក", "រកា", "ច", "កុរ"],
  en: ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"],
}

export const ANIMAL_EMOJIS = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖"]

export const SAKS: Record<Lang, string[]> = {
  km: ["សំរឹទ្ធិស័ក", "ឯកស័ក", "ទោស័ក", "ត្រីស័ក", "ចត្វាស័ក", "បញ្ចស័ក", "ឆស័ក", "សប្តស័ក", "អដ្ឋស័ក", "នព្វស័ក"],
  en: ["Samridhi Sak", "Ek Sak", "To Sak", "Trei Sak", "Chattva Sak", "Pancha Sak", "Chha Sak", "Sapta Sak", "Attha Sak", "Nappa Sak"],
}

export const WEEKDAYS: Record<Lang, string[]> = {
  km: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
}

export const WEEKDAYS_SHORT: Record<Lang, string[]> = {
  km: ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
}

export const PHASES: Record<Lang, Record<"kert" | "roech", string>> = {
  km: { kert: "កើត", roech: "រោច" },
  en: { kert: "Waxing", roech: "Waning" },
}

export const PHASES_SHORT: Record<Lang, Record<"kert" | "roech", string>> = {
  km: { kert: "ក", roech: "រ" },
  en: { kert: "K", roech: "R" },
}

export const MOON_PHASES: Record<Lang, Record<"first-quarter" | "full" | "last-quarter" | "new", string>> = {
  km: { "first-quarter": "៨កើត", full: "ពេញបូណ៌មី", "last-quarter": "៨រោច", new: "ថ្ងៃដាច់ខែ" },
  en: { "first-quarter": "First quarter", full: "Full moon", "last-quarter": "Last quarter", new: "New moon" },
}

export const HOLY_DAY_NAME: Record<Lang, string> = {
  km: "ថ្ងៃសីល",
  en: "Buddhist holy day",
}

export const LEAP_TYPES: Record<Lang, Record<"regular" | "leap-month" | "leap-day", string>> = {
  km: { regular: "ឆ្នាំធម្មតា", "leap-month": "អធិកមាស", "leap-day": "ចន្ទ្រាធិមាស" },
  en: { regular: "Regular year", "leap-month": "Leap month", "leap-day": "Leap day" },
}
