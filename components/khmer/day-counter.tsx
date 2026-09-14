"use client"

import { ArrowLeftRightIcon, CheckIcon } from "lucide-react"
import { useState } from "react"
import { useLang } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { apiGet } from "@/lib/api/client"
import type { DaysBetweenView } from "@/lib/api/views"
import type { SerializedLunarDate } from "@/lib/khmer/format"
import { HolidayList } from "./holiday-list"
import { Panel, PanelHeader } from "./panel"

type Mode = "all" | "no-weekends" | "no-holidays" | "working"

const MODES: Record<Mode, { weekends: boolean; holidays: boolean }> = {
  all: { weekends: false, holidays: false },
  "no-weekends": { weekends: true, holidays: false },
  "no-holidays": { weekends: false, holidays: true },
  working: { weekends: true, holidays: true },
}

interface CounterState {
  from: string
  to: string
  mode: Mode
  weekend: string
  includeEnd: boolean
}

export function DayCounter({ initial }: { initial: DaysBetweenView }) {
  const { t, lang } = useLang()
  const [state, setState] = useState<CounterState>({
    from: initial.from,
    to: initial.to,
    mode: "all",
    weekend: initial.options.weekend.join(","),
    includeEnd: initial.options.includeEnd,
  })
  const [result, setResult] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function update(patch: Partial<CounterState>) {
    const next = { ...state, ...patch }
    setState(next)
    if (!next.from || !next.to) return

    const { weekends, holidays } = MODES[next.mode]
    const exclude = [weekends && "weekends", holidays && "holidays"].filter(Boolean).join(",")
    setLoading(true)
    try {
      setResult(
        await apiGet<DaysBetweenView>("/api/v1/count", {
          from: next.from,
          to: next.to,
          lang,
          exclude,
          weekend: next.weekend,
          includeEnd: String(next.includeEnd),
        })
      )
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const { weekends: skipWeekends, holidays: skipHolidays } = MODES[state.mode]
  const excludedWeekends = skipWeekends ? result.weekendDays : 0
  const excludedHolidays = skipHolidays ? result.holidayDays - (skipWeekends ? result.holidaysOnWeekend : 0) : 0
  const signedCount = result.days < 0 ? -result.countedDays : result.countedDays

  const stats = [
    [t.count.workingDays, result.workingDays],
    [t.count.weekends, result.weekendDays],
    [t.count.holidayDays, result.holidayDays],
    [t.count.holyDays, result.holyDays],
  ] as const

  return (
    <Panel aria-busy={loading}>
      <PanelHeader title={t.count.between} description={t.count.description} />

      <div className="space-y-6">
        {/* From and To share one row at every width, with the swap button between them */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-1.5 sm:gap-3">
          <DateField id="count-from" label={t.count.from} value={state.from} lunar={result.fromLunar} onChange={(v) => update({ from: v })} />
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Swap"
            className="mb-6 sm:size-8"
            onClick={() => update({ from: state.to, to: state.from })}
          >
            <ArrowLeftRightIcon />
          </Button>
          <DateField id="count-to" label={t.count.to} value={state.to} lunar={result.toLunar} onChange={(v) => update({ to: v })} />
        </div>

        <div className="space-y-4 rounded-lg border p-3 sm:p-4">
          <div className="space-y-2">
            <p className="micro-label text-muted-foreground">{t.count.mode}</p>
            <ToggleGroup
              aria-label={t.count.mode}
              variant="outline"
              size="sm"
              spacing={1}
              className="grid w-full grid-cols-2 sm:flex sm:w-fit sm:flex-wrap"
              value={[state.mode]}
              onValueChange={(v) => v[0] && update({ mode: v[0] as Mode })}
            >
              {(Object.keys(MODES) as Mode[]).map((mode) => (
                <ToggleGroupItem
                  key={mode}
                  value={mode}
                  className="h-auto min-h-8 w-full py-1.5 whitespace-normal sm:w-auto"
                >
                  {t.count.modes[mode]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div className="space-y-2">
              <p className="micro-label text-muted-foreground">{t.count.weekend}</p>
              <ToggleGroup
                aria-label={t.count.weekend}
                variant="outline"
                size="sm"
                spacing={0}
                value={[state.weekend]}
                onValueChange={(v) => v[0] && update({ weekend: v[0] })}
              >
                <ToggleGroupItem value="0,6">{t.count.weekendSatSun}</ToggleGroupItem>
                <ToggleGroupItem value="0">{t.count.weekendSun}</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Toggle
              variant="outline"
              size="sm"
              pressed={state.includeEnd}
              onPressedChange={(pressed) => update({ includeEnd: pressed })}
            >
              {state.includeEnd && <CheckIcon />}
              {t.count.includeEnd}
            </Toggle>
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : (
          <div className={loading ? "space-y-6 opacity-60 transition-opacity" : "space-y-6 transition-opacity"}>
            <div className="rounded-xl bg-accent p-4 text-accent-foreground sm:p-5">
              <p className="micro-label">{t.count.modes[state.mode]}</p>
              <p className="display-type mt-1 text-4xl tabular-nums">{t.common.days(signedCount)}</p>
              <p className="mt-2 text-sm">{t.count.breakdown(result.totalDays, excludedWeekends, excludedHolidays)}</p>
              <p className="text-sm opacity-80">
                {t.count.weeks(result.weeks, result.remainingDays)} ·{" "}
                {t.count.calendarSpan(result.calendar.years, result.calendar.months, result.calendar.days)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {stats.map(([label, value]) => (
                <div key={label} className="rounded-lg border p-3">
                  <p className="micro-label text-muted-foreground">{label}</p>
                  <p className="text-2xl font-semibold tabular-nums">{t.num(value)}</p>
                </div>
              ))}
            </div>

            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold">
                {t.count.holidaysInRange} ({t.num(result.holidays.length)})
              </h3>
              <HolidayList
                holidays={result.holidays.slice(0, 12).map((h) => ({ ...h, dates: [h.date], lunar: false, lunarDates: [] }))}
              />
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}

function DateField({
  id,
  label,
  value,
  lunar,
  onChange,
}: {
  id: string
  label: string
  value: string
  lunar: SerializedLunarDate
  onChange: (value: string) => void
}) {
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        autoComplete="off"
        min="1900-01-01"
        max="2100-12-31"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 text-sm sm:px-2.5"
      />
      <p className="h-4 truncate text-xs text-muted-foreground" title={lunar.formattedShort}>
        {lunar.formattedShort}
      </p>
    </div>
  )
}
