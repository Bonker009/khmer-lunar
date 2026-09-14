"use client"

import { useLang } from "@/components/providers"
import { Badge } from "@/components/ui/badge"
import { formatGregorian, type SerializedLunarDate } from "@/lib/khmer/format"
import { MoonPhase } from "./moon-phase"

const chip = "bg-hero-chip text-hero-chip-foreground"

export function TodayHero({ data }: { data: SerializedLunarDate }) {
  const { t, lang } = useLang()
  const { animal, sak } = data.year

  return (
    <section className="relative overflow-hidden rounded-xl bg-linear-to-br from-hero-from to-hero-to p-6 text-hero-foreground shadow-immersive sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-hero-accent/15 blur-3xl" />
      <div className="relative flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="micro-label text-hero-muted">{t.home.eyebrow}</p>
          <p className="mt-1 text-sm text-hero-muted">{formatGregorian(data.date, lang, true)}</p>
          <h2 className="display-type mt-5 text-4xl leading-tight sm:text-5xl">{data.formattedShort}</h2>
          <p className="mt-2 text-lg font-semibold text-hero-accent">
            {lang === "km" ? `ឆ្នាំ${animal.name}` : `Year of the ${animal.name}`} {animal.emoji} · {sak.name}
          </p>
        </div>
        <MoonPhase
          dayNumber={data.lunar.dayOfMonth - 1}
          monthLength={data.lunar.month.days}
          label={data.moonPhase?.name ?? data.lunar.phaseName}
          className="size-20 text-hero-foreground sm:size-28"
        />
      </div>

      <p className="relative mt-6 text-hero-muted">{data.formatted}</p>

      <div className="relative mt-5 flex flex-wrap gap-2">
        <Badge variant="ghost" className={chip}>
          {t.lunar.buddhistEra} {t.num(data.year.buddhistEra)}
        </Badge>
        <Badge variant="ghost" className={chip}>
          {t.lunar.jolakSakaraj} {t.num(data.year.jolakSakaraj)}
        </Badge>
        <Badge variant="ghost" className={chip}>
          {data.lunar.leapTypeName}
        </Badge>
        {data.holyDay && (
          <Badge variant="ghost" className="bg-hero-accent text-hero-accent-foreground">
            {data.holyDay.name}
          </Badge>
        )}
        {data.moonPhase && (
          <Badge variant="ghost" className={chip}>
            {data.moonPhase.name}
          </Badge>
        )}
        {data.holidays.map((h) => (
          <Badge key={h.id} variant="ghost" className="bg-holiday-solid text-holiday-solid-foreground">
            {h.name}
          </Badge>
        ))}
      </div>
    </section>
  )
}
