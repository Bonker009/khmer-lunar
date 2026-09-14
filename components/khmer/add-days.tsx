"use client"

import { useState } from "react"
import { useLang } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiGet } from "@/lib/api/client"
import type { SerializedLunarDate } from "@/lib/khmer/format"
import { LunarDetails } from "./lunar-details"
import { Panel, PanelHeader } from "./panel"

const PRESETS = [-30, 7, 30, 100, 365]

export function AddDays({ today, initialDays, initial }: { today: string; initialDays: number; initial: SerializedLunarDate }) {
  const { t, lang } = useLang()
  const [date, setDate] = useState(today)
  const [days, setDays] = useState(String(initialDays))
  const [result, setResult] = useState(initial)
  const [error, setError] = useState<string | null>(null)

  async function update(nextDate: string, nextDays: string) {
    setDate(nextDate)
    setDays(nextDays)
    if (!nextDate || nextDays === "" || nextDays === "-") return
    try {
      const data = await apiGet<{ result: SerializedLunarDate }>("/api/v1/add", { date: nextDate, days: nextDays, lang })
      setResult(data.result)
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <Panel>
      <PanelHeader title={t.count.add} />
      <div className="space-y-5">
        <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-3 sm:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <Label htmlFor="add-date">{t.count.baseDate}</Label>
            <Input
              id="add-date"
              type="date"
              autoComplete="off"
              min="1900-01-01"
              max="2100-12-31"
              value={date}
              onChange={(e) => update(e.target.value, days)}
            />
          </div>
          <div className="min-w-0 space-y-2">
            <Label htmlFor="add-days">{t.count.daysToAdd}</Label>
            <Input
              id="add-days"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              value={days}
              onChange={(e) => update(date, e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((n) => (
            <Button key={n} variant={String(n) === days ? "secondary" : "outline"} size="sm" onClick={() => update(date, String(n))}>
              {n > 0 ? "+" : "−"}
              {t.num(Math.abs(n))}
            </Button>
          ))}
        </div>
        {error ? (
          <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : (
          <LunarDetails data={result} />
        )}
      </div>
    </Panel>
  )
}
