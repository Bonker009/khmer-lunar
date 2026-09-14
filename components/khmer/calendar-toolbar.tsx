"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLang } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GREGORIAN_MONTHS, MAX_YEAR, MIN_YEAR } from "@/lib/khmer/constants"
import { YearSelect } from "./year-select"

export function CalendarToolbar({
  year,
  month,
  weekStart,
  today,
}: {
  year: number
  month: number
  weekStart: 0 | 1
  today: string
}) {
  const { t, lang } = useLang()
  const router = useRouter()

  const go = (y: number, m: number, w: number = weekStart) =>
    router.push(`/calendar/${y}/${m}${w ? "?weekStart=1" : ""}`)

  const prev = month === 1 ? [year - 1, 12] : [year, month - 1]
  const next = month === 12 ? [year + 1, 1] : [year, month + 1]
  const [todayYear, todayMonth] = today.split("-").map(Number)
  const monthItems = Object.fromEntries(GREGORIAN_MONTHS[lang].map((name, i) => [String(i + 1), name]))

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="icon-sm" aria-label={t.common.previous} disabled={prev[0] < MIN_YEAR} onClick={() => go(prev[0], prev[1])}>
        <ChevronLeftIcon />
      </Button>
      <Select value={String(month)} items={monthItems} onValueChange={(v) => v && go(year, Number(v))}>
        <SelectTrigger size="sm" className="w-32" aria-label={t.common.month}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GREGORIAN_MONTHS[lang].map((name, i) => (
            <SelectItem key={name} value={String(i + 1)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <YearSelect value={year} onChange={(y) => go(y, month)} />
      <Button variant="outline" size="icon-sm" aria-label={t.common.next} disabled={next[0] > MAX_YEAR} onClick={() => go(next[0], next[1])}>
        <ChevronRightIcon />
      </Button>
      <Button variant="secondary" size="sm" onClick={() => go(todayYear, todayMonth)}>
        {t.common.today}
      </Button>
      <ToggleGroup
        aria-label={t.calendar.weekStart}
        variant="outline"
        size="sm"
        spacing={0}
        value={[String(weekStart)]}
        onValueChange={(v) => v[0] && go(year, month, Number(v[0]))}
      >
        <ToggleGroupItem value="0">{t.calendar.sunday}</ToggleGroupItem>
        <ToggleGroupItem value="1">{t.calendar.monday}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
