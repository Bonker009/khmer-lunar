import { describe, expect, it } from "vitest"
import {
  MonthIndex,
  countdown,
  daysBetween,
  formatLunar,
  getHolidays,
  getKhmerNewYear,
  getLunarDate,
  getLunarYear,
  getMonthCalendar,
  khmerToGregorian,
  toJdn,
} from "../index"

describe("gregorian → lunar", () => {
  // Dates from published Cambodian calendars
  const fixtures: [date: string, day: number, phase: "kert" | "roech", month: number, be: number][] = [
    ["2023-10-14", 15, "roech", MonthIndex.Phatrabot, 2567], // Pchum Ben 2023
    ["2024-05-22", 15, "kert", MonthIndex.Pisakh, 2567], // Visak Bochea 2024
    ["2024-10-02", 15, "roech", MonthIndex.Phatrabot, 2568], // Pchum Ben 2024
    ["2024-11-15", 15, "kert", MonthIndex.Kadeuk, 2568], // Water Festival 2024
    ["2025-05-11", 15, "kert", MonthIndex.Pisakh, 2568], // Visak Bochea 2025
    ["2025-05-12", 1, "roech", MonthIndex.Pisakh, 2569], // BE increments
    ["2026-09-14", 3, "kert", MonthIndex.Phatrabot, 2570],
  ]

  it.each(fixtures)("%s is %i %s month %i BE %i", (date, day, phase, month, be) => {
    const lunar = getLunarDate(date)
    expect(lunar.lunarDay).toBe(day)
    expect(lunar.phase).toBe(phase)
    expect(lunar.monthIndex).toBe(month)
    expect(lunar.beYear).toBe(be)
  })

  it("changes the animal year at New Year and the sak at Lerng Sak", () => {
    expect(getLunarDate("2025-04-13").animalYear).toBe(4) // Dragon
    expect(getLunarDate("2025-04-14").animalYear).toBe(5) // Snake
    expect(getLunarDate("2025-04-15").sak).toBe(6) // Chha Sak
    expect(getLunarDate("2025-04-16").sak).toBe(7) // Sapta Sak
  })

  it("formats in Khmer and English", () => {
    const lunar = getLunarDate("2025-05-11")
    expect(formatLunar(lunar, "km")).toBe("ថ្ងៃអាទិត្យ ១៥កើត ខែពិសាខ ឆ្នាំម្សាញ់ សប្តស័ក ពុទ្ធសករាជ ២៥៦៨")
    expect(formatLunar(lunar, "en")).toBe("Sunday, 15 Waxing of Pisakh, Year of the Snake, Sapta Sak, BE 2568")
  })

  it("rejects dates outside the supported range", () => {
    expect(() => getLunarDate("1899-12-31")).toThrow(RangeError)
    expect(() => getLunarDate("2025-02-30")).toThrow(RangeError)
  })
})

describe("lunar year structure", () => {
  it("has only valid year and month lengths", () => {
    for (let year = 1900; year <= 2100; year++) {
      const span = getLunarYear(year)
      const expected = { regular: 354, "leap-day": 355, "leap-month": 384 }[span.leapType]
      expect(span.length).toBe(expected)
      expect(span.months.length).toBe(span.leapType === "leap-month" ? 13 : 12)
      expect(getLunarYear(year + 1).start).toBe(span.start + span.length)
    }
  })

  it("round-trips every day from 1900 to 2100", () => {
    for (let jdn = toJdn(1900, 1, 1); jdn <= toJdn(2100, 12, 31); jdn++) {
      const lunar = getLunarDate(jdn)
      const back = khmerToGregorian({
        beYear: lunar.beYear,
        monthIndex: lunar.monthIndex,
        day: lunar.lunarDay,
        phase: lunar.phase,
      })
      if (back.jdn !== jdn) throw new Error(`Round trip failed for ${lunar.date}`)
    }
  })

  it("rejects lunar dates that don't exist", () => {
    // 2025 (BE 2569 from May) is a regular year: no leap Asadh
    expect(() => khmerToGregorian({ beYear: 2569, monthIndex: 12, day: 1, phase: "kert" })).toThrow(RangeError)
    // Meak has 29 days: no 15 រោច
    expect(() => khmerToGregorian({ beYear: 2569, monthIndex: MonthIndex.Meak, day: 15, phase: "roech" })).toThrow(RangeError)
  })
})

describe("new year and holidays", () => {
  it("computes Khmer New Year", () => {
    expect(getKhmerNewYear(2024)).toMatchObject({ date: "2024-04-13", time: "22:17", days: 4 })
    expect(getKhmerNewYear(2025)).toMatchObject({ date: "2025-04-14", days: 3 })
    expect(getKhmerNewYear(2026)).toMatchObject({ date: "2026-04-14", days: 3 })
  })

  it("places lunar holidays", () => {
    const holidays = getHolidays(2024)
    const byId = (id: string) => holidays.find((h) => h.id === id)!.dates
    expect(byId("pchum-ben")).toEqual(["2024-10-01", "2024-10-02", "2024-10-03"])
    expect(byId("water-festival")).toEqual(["2024-11-14", "2024-11-15", "2024-11-16"])
    expect(byId("visak-bochea")).toEqual(["2024-05-22"])
    expect(byId("royal-ploughing")).toEqual(["2024-05-26"])
  })
})

describe("counting", () => {
  it("counts days between dates", () => {
    const result = daysBetween("2024-01-01", "2024-12-31")
    expect(result.days).toBe(365)
    expect(result.totalDays).toBe(365)
    expect(result.countedDays).toBe(365)
    expect(result.weeks).toBe(52)
    expect(result.calendar).toEqual({ years: 0, months: 11, days: 30 })
    expect(daysBetween("2024-01-01", "2024-12-31", { includeEnd: true }).totalDays).toBe(366)
    expect(daysBetween("2024-12-31", "2024-01-01").days).toBe(-365)
  })

  it("counts working days, skipping weekends and public holidays", () => {
    // Mon 2026-09-21 … Sun 2026-09-27, with Constitution Day on Thursday the 24th
    const week = { includeEnd: true }
    expect(daysBetween("2026-09-21", "2026-09-27", week)).toMatchObject({
      totalDays: 7,
      weekendDays: 2,
      holidayDays: 1,
      workingDays: 4,
    })
    expect(daysBetween("2026-09-21", "2026-09-27", { ...week, excludeWeekends: true }).countedDays).toBe(5)
    expect(daysBetween("2026-09-21", "2026-09-27", { ...week, excludeHolidays: true }).countedDays).toBe(6)
    expect(
      daysBetween("2026-09-21", "2026-09-27", { ...week, excludeWeekends: true, excludeHolidays: true }).countedDays
    ).toBe(4)
    // Sunday-only weekend
    expect(daysBetween("2026-09-21", "2026-09-27", { ...week, weekend: [0], excludeWeekends: true }).countedDays).toBe(6)
  })

  it("does not remove a holiday that falls on a weekend twice", () => {
    // Pchum Ben 2026 is Sat 10 – Mon 12 October
    const range = { includeEnd: true }
    const result = daysBetween("2026-10-05", "2026-10-11", { ...range, excludeWeekends: true, excludeHolidays: true })
    expect(result).toMatchObject({ totalDays: 7, weekendDays: 2, holidayDays: 2, holidaysOnWeekend: 2, countedDays: 5 })
    expect(daysBetween("2026-10-05", "2026-10-11", { ...range, excludeHolidays: true }).countedDays).toBe(5)
  })

  it("lists upcoming events in order", () => {
    const events = countdown("2026-09-14")
    expect(events[0].daysUntil).toBeGreaterThanOrEqual(0)
    expect(events.map((e) => e.daysUntil)).toEqual([...events.map((e) => e.daysUntil)].sort((a, b) => a - b))
    expect(events.find((e) => e.id === "khmer-new-year")?.date).toBe(getKhmerNewYear(2027).date)
  })

  it("builds a month grid", () => {
    const calendar = getMonthCalendar(2026, 9)
    expect(calendar.weeks.every((w) => w.length === 7)).toBe(true)
    expect(calendar.weeks.flat().filter((d) => d.inMonth)).toHaveLength(30)
  })
})
