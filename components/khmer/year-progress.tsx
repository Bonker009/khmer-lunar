"use client"

import { useLang } from "@/components/providers"
import type { DayOfYear } from "@/lib/khmer/count"

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = Math.round((value / total) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between gap-4 text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground tabular-nums">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export function YearProgress({ data }: { data: DayOfYear }) {
  const { t } = useLang()
  return (
    <div className="space-y-4">
      <Bar
        label={t.home.gregorianDay(data.gregorian.dayOfYear, data.gregorian.daysInYear)}
        value={data.gregorian.dayOfYear}
        total={data.gregorian.daysInYear}
      />
      <Bar
        label={t.home.lunarYearDay(data.lunarYear.dayOfYear, data.lunarYear.daysInYear)}
        value={data.lunarYear.dayOfYear}
        total={data.lunarYear.daysInYear}
      />
      {data.sinceKhmerNewYear && (
        <p className="text-sm text-muted-foreground">{t.home.sinceNewYear(data.sinceKhmerNewYear.day)}</p>
      )}
    </div>
  )
}
