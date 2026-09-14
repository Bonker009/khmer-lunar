"use client"

import { useLang } from "@/components/providers"
import { Badge } from "@/components/ui/badge"
import { formatGregorian, type SerializedLunarDate } from "@/lib/khmer/format"
import { CopyButton } from "./copy-button"
import { MoonPhase } from "./moon-phase"

export function LunarDetails({ data }: { data: SerializedLunarDate }) {
  const { t, lang } = useLang()

  const rows: [string, string][] = [
    [t.common.solar, formatGregorian(data.date, lang, true)],
    [t.lunar.lunarMonth, `${data.lunar.month.name} · ${t.lunar.monthDays(data.lunar.month.days)}`],
    [t.lunar.lunarDay, `${t.num(data.lunar.day)} ${data.lunar.phaseName}`],
    [t.lunar.buddhistEra, t.num(data.year.buddhistEra)],
    [t.lunar.jolakSakaraj, t.num(data.year.jolakSakaraj)],
    [t.lunar.animalYear, `${data.year.animal.emoji} ${data.year.animal.name}`],
    [t.lunar.sak, data.year.sak.name],
    [t.lunar.leapType, data.lunar.leapTypeName],
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start gap-3 rounded-xl bg-accent p-4 text-accent-foreground sm:flex-nowrap sm:gap-4">
        <MoonPhase
          dayNumber={data.lunar.dayOfMonth - 1}
          monthLength={data.lunar.month.days}
          className="size-12 text-foreground sm:size-14"
          litClassName="fill-brand"
        />
        <div className="min-w-0 flex-1 basis-40">
          <p className="display-type text-2xl">{data.formattedShort}</p>
          <p className="mt-1 text-sm">{data.formatted}</p>
        </div>
        <CopyButton text={data.formatted} />
      </div>

      {(data.holyDay || data.moonPhase || data.holidays.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {data.holyDay && (
            <Badge variant="ghost" className="bg-holy-soft text-holy">
              {data.holyDay.name}
            </Badge>
          )}
          {data.moonPhase && <Badge variant="secondary">{data.moonPhase.name}</Badge>}
          {data.holidays.map((h) => (
            <Badge
              key={h.id}
              variant="ghost"
              className={h.type === "public" ? "bg-holiday-soft text-holiday" : "bg-observance-soft text-observance"}
            >
              {h.name}
            </Badge>
          ))}
        </div>
      )}

      <dl className="grid gap-x-8 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 border-b py-2 text-sm">
            <dt className="shrink-0 text-muted-foreground">{label}</dt>
            <dd className="min-w-0 text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
