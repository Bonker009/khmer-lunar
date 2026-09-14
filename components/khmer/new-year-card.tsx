"use client"

import { useLang } from "@/components/providers"
import type { NewYearView } from "@/lib/api/views"
import { formatGregorian } from "@/lib/khmer/format"

export function NewYearCard({ data }: { data: NewYearView }) {
  const { t, lang } = useLang()

  return (
    <section className="relative h-fit overflow-hidden rounded-xl bg-linear-to-br from-hero-from to-hero-to p-5 text-hero-foreground shadow-immersive sm:p-6">
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 size-60 rounded-full bg-hero-accent/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="micro-label text-hero-muted">
            {t.holidays.newYear} {t.num(data.year)}
          </p>
          <span className="text-4xl" aria-hidden>
            {data.animalYear.emoji}
          </span>
        </div>
        <h2 className="display-type mt-3 text-2xl leading-snug">{formatGregorian(data.date, lang, true)}</h2>
        <p className="mt-2 text-hero-muted">
          {t.holidays.arrival} <span className="font-semibold text-hero-accent tabular-nums">{t.num(data.time)}</span>
        </p>
        <p className="mt-1 text-sm text-hero-muted">
          {lang === "km" ? `ឆ្នាំ${data.animalYear.name}` : `Year of the ${data.animalYear.name}`} · {data.sak.name} ·{" "}
          {t.holidays.celebration(data.days)}
        </p>

        <ol className="mt-6 space-y-3">
          {data.schedule.map((day, i) => (
            <li key={day.date} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-hero-chip text-sm text-hero-chip-foreground tabular-nums">
                {t.num(i + 1)}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{day.name}</p>
                <p className="text-sm text-hero-muted">
                  {formatGregorian(day.date, lang, true)} · {day.lunar}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
