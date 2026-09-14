import type { Lang } from "@/lib/khmer/constants"

export interface EndpointParam {
  name: string
  required: boolean
  example: string
  options?: string[]
  description: Record<Lang, string>
}

export interface EndpointSpec {
  id: string
  path: string
  summary: Record<Lang, string>
  params: EndpointParam[]
}

const lang: EndpointParam = {
  name: "lang",
  required: false,
  example: "km",
  options: ["km", "en"],
  description: { km: "ភាសានៃអត្ថបទ (លំនាំដើម km)", en: "Language of text fields (default km)" },
}

const year: EndpointParam = {
  name: "year",
  required: true,
  example: "2026",
  description: { km: "ឆ្នាំសុរិយគតិ (1900–2100)", en: "Gregorian year (1900–2100)" },
}

export const ENDPOINTS: EndpointSpec[] = [
  {
    id: "today",
    path: "/api/v1/today",
    summary: { km: "ថ្ងៃខែចន្ទគតិនៃថ្ងៃនេះ (ម៉ោងភ្នំពេញ)", en: "Today's lunar date (Phnom Penh time)" },
    params: [lang],
  },
  {
    id: "convert",
    path: "/api/v1/convert",
    summary: { km: "បំប្លែងពីសុរិយគតិទៅចន្ទគតិ", en: "Convert a Gregorian date to the Khmer lunar calendar" },
    params: [
      { name: "date", required: true, example: "2026-04-14", description: { km: "កាលបរិច្ឆេទ YYYY-MM-DD", en: "Date as YYYY-MM-DD" } },
      lang,
    ],
  },
  {
    id: "reverse",
    path: "/api/v1/convert/reverse",
    summary: { km: "បំប្លែងពីចន្ទគតិទៅសុរិយគតិ", en: "Convert a Khmer lunar date to a Gregorian date" },
    params: [
      { name: "be", required: true, example: "2570", description: { km: "ឆ្នាំពុទ្ធសករាជ", en: "Buddhist Era year" } },
      { name: "month", required: true, example: "9", description: { km: "លេខខែចន្ទគតិ 0–13 (0 = មិគសិរ)", en: "Lunar month index 0–13 (0 = Migasir)" } },
      { name: "day", required: true, example: "15", description: { km: "ថ្ងៃទី 1–15", en: "Lunar day 1–15" } },
      { name: "phase", required: true, example: "roech", options: ["kert", "roech"], description: { km: "កើត ឬ រោច", en: "Waxing (kert) or waning (roech)" } },
      lang,
    ],
  },
  {
    id: "calendar",
    path: "/api/v1/calendar",
    summary: { km: "ប្រតិទិនមួយខែ ជាមួយព័ត៌មានចន្ទគតិ", en: "A month grid with lunar info for every day" },
    params: [
      year,
      { name: "month", required: true, example: "9", description: { km: "ខែសុរិយគតិ 1–12", en: "Gregorian month 1–12" } },
      { name: "weekStart", required: false, example: "0", options: ["0", "1"], description: { km: "ថ្ងៃចាប់ផ្តើមសប្តាហ៍ (0 = អាទិត្យ)", en: "First day of the week (0 = Sunday)" } },
      lang,
    ],
  },
  {
    id: "count",
    path: "/api/v1/count",
    summary: { km: "រាប់ចំនួនថ្ងៃរវាងកាលបរិច្ឆេទពីរ", en: "Count days between two dates" },
    params: [
      { name: "from", required: true, example: "2026-01-01", description: { km: "ចាប់ពី", en: "Start date" } },
      { name: "to", required: true, example: "2026-12-31", description: { km: "ដល់", en: "End date" } },
      {
        name: "exclude",
        required: false,
        example: "weekends,holidays",
        description: {
          km: "មិនរាប់៖ weekends, holidays ឬទាំងពីរ (តែថ្ងៃធ្វើការ)",
          en: "Leave out weekends, holidays or both (working days only)",
        },
      },
      {
        name: "weekend",
        required: false,
        example: "0,6",
        description: { km: "ថ្ងៃចុងសប្តាហ៍ 0–6 (0 = អាទិត្យ, លំនាំដើម 0,6)", en: "Weekend weekdays 0–6 (0 = Sunday, default 0,6)" },
      },
      {
        name: "includeEnd",
        required: false,
        example: "false",
        options: ["false", "true"],
        description: { km: "រាប់បញ្ចូលថ្ងៃបញ្ចប់", en: "Count the end date too" },
      },
      lang,
    ],
  },
  {
    id: "add",
    path: "/api/v1/add",
    summary: { km: "បូក ឬដកចំនួនថ្ងៃពីកាលបរិច្ឆេទ", en: "Add or subtract days from a date" },
    params: [
      { name: "date", required: true, example: "2026-09-14", description: { km: "កាលបរិច្ឆេទចាប់ផ្តើម", en: "Start date" } },
      { name: "days", required: true, example: "100", description: { km: "ចំនួនថ្ងៃ (អាចជាលេខអវិជ្ជមាន)", en: "Number of days (can be negative)" } },
      lang,
    ],
  },
  {
    id: "countdown",
    path: "/api/v1/countdown",
    summary: { km: "ចំនួនថ្ងៃទៅដល់ព្រឹត្តិការណ៍ខាងមុខ", en: "Days until upcoming festivals and moon phases" },
    params: [
      { name: "date", required: false, example: "2026-09-14", description: { km: "ចាប់ពីកាលបរិច្ឆេទ (លំនាំដើម ថ្ងៃនេះ)", en: "Count from this date (default today)" } },
      lang,
    ],
  },
  {
    id: "holidays",
    path: "/api/v1/holidays",
    summary: { km: "ថ្ងៃបុណ្យ និងថ្ងៃឈប់សម្រាកក្នុងមួយឆ្នាំ", en: "Public holidays and observances for a year" },
    params: [
      year,
      { name: "type", required: false, example: "public", options: ["public", "observance"], description: { km: "ប្រភេទ", en: "Filter by type" } },
      lang,
    ],
  },
  {
    id: "holy-days",
    path: "/api/v1/holy-days",
    summary: { km: "ថ្ងៃសីល (៨កើត ១៥កើត ៨រោច និងចុងខែ)", en: "Buddhist holy days (8 & 15 waxing, 8 waning, last day)" },
    params: [
      year,
      { name: "month", required: false, example: "9", description: { km: "ខែសុរិយគតិ 1–12", en: "Gregorian month 1–12" } },
      lang,
    ],
  },
  {
    id: "new-year",
    path: "/api/v1/new-year",
    summary: { km: "ពេលវេលាចូលឆ្នាំខ្មែរ (មហាសង្ក្រាន្ត)", en: "Khmer New Year date and exact arrival time" },
    params: [year, lang],
  },
  {
    id: "year",
    path: "/api/v1/year",
    summary: { km: "ព័ត៌មានតារាសាស្ត្រប្រចាំឆ្នាំ", en: "Astronomical values and leap info for a year" },
    params: [year, lang],
  },
]
