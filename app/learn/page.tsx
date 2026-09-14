import { ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { MoonPhase } from "@/components/khmer/moon-phase"
import { Panel } from "@/components/khmer/panel"
import { JsonLd } from "@/components/seo/json-ld"
import { buttonVariants } from "@/components/ui/button"
import { LEARN } from "@/lib/i18n/learn"
import { seoCopy } from "@/lib/i18n/seo"
import { getServerDictionary, getServerLang } from "@/lib/i18n/server"
import {
  ANIMAL_EMOJIS,
  ANIMAL_YEARS,
  formatLunar,
  getLunarDate,
  LUNAR_MONTHS,
  monthLength,
  PHASES,
  SAKS,
  todayISO,
} from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"
import { absoluteUrl, localizedPath } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return pageMetadata({ path: "/learn", lang, ...seoCopy("learn", lang) })
}

// Moon at 1, 8 and 15 Kert, 8 Roech and the last day of a 30-day month
const MOON_STEPS = [0, 7, 14, 22, 29]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Panel id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20">
      <h2 id={`${id}-title`} className="mb-4 text-xl font-semibold">
        {title}
      </h2>
      <div className="space-y-4 leading-relaxed">{children}</div>
    </Panel>
  )
}

export default async function LearnPage() {
  const { lang, t } = await getServerDictionary()
  const c = LEARN[lang]
  const copy = seoCopy("learn", lang)
  const today = getLunarDate(todayISO())
  const other = lang === "km" ? "en" : "km"

  const sections = [
    { id: "what", title: c.intro.title },
    { id: "kert-roech", title: c.phases.title },
    { id: "months", title: c.months.title },
    { id: "leap", title: c.leap.title },
    { id: "holy-days", title: c.holyDays.title },
    { id: "years", title: c.years.title },
    { id: "new-year", title: c.newYear.title },
    { id: "reading", title: c.reading.title },
    { id: "festivals", title: c.festivals.title },
    { id: "glossary", title: c.glossary.title },
  ]

  const dateParts = (
    lang === "km"
      ? ["[ថ្ងៃ]W", "dN", "[ខែ]m", "[ឆ្នាំ]a", "e", "[ព.ស. ]b"]
      : ["W", "d N", "m", "[Year of the ]a", "e", "[BE ]b"]
  ).map((pattern) => formatLunar(today, lang, pattern))

  return (
    <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      <h1 className="sr-only">{copy.title}</h1>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: copy.title,
          description: copy.description,
          inLanguage: lang,
          url: absoluteUrl(localizedPath("/learn", lang)),
          about: { "@type": "Thing", name: lang === "km" ? "ប្រតិទិនចន្ទគតិខ្មែរ" : "Khmer lunar calendar" },
          hasPart: {
            "@type": "DefinedTermSet",
            name: c.glossary.title,
            hasDefinedTerm: c.glossary.terms.map((term) => ({
              "@type": "DefinedTerm",
              name: term.term,
              alternateName: term.romanized,
              description: term.text,
            })),
          },
        }}
      />

      <nav aria-label={c.toc} className="hidden lg:sticky lg:top-20 lg:block">
        <p className="micro-label mb-2 text-muted-foreground">{c.toc}</p>
        <ol className="space-y-0.5 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0 space-y-10 lg:space-y-6">
        <Section id="what" title={c.intro.title}>
          {c.intro.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Section>

        <Section id="kert-roech" title={c.phases.title}>
          {c.phases.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ol className="grid grid-cols-5 gap-2 rounded-xl bg-accent p-4 text-accent-foreground">
            {MOON_STEPS.map((dayNumber) => {
              const phase = dayNumber < 15 ? "kert" : "roech"
              const day = dayNumber < 15 ? dayNumber + 1 : dayNumber - 14
              return (
                <li key={dayNumber} className="flex flex-col items-center gap-2 text-center">
                  <MoonPhase dayNumber={dayNumber} monthLength={30} className="size-10 text-foreground sm:size-12" litClassName="fill-moon" />
                  <span className="text-xs font-semibold sm:text-sm">
                    {t.num(day)}
                    {lang === "km" ? PHASES.km[phase] : ` ${PHASES.en[phase]}`}
                  </span>
                </li>
              )
            })}
          </ol>
        </Section>

        <Section id="months" title={c.months.title}>
          {c.months.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  {c.months.columns.map((col) => (
                    <th key={col} scope="col" className="px-3 py-2 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {c.months.spans.map((span, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 font-medium">{LUNAR_MONTHS[lang][index]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{LUNAR_MONTHS[other][index]}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {t.num(monthLength(index, "regular"))}
                      {index === 6 && ` / ${t.num(30)}`}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{span}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">{c.months.note}</p>
        </Section>

        <Section id="leap" title={c.leap.title}>
          <p>{c.leap.body}</p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {c.leap.rows.map((row) => (
              <li key={row.name} className="rounded-lg border p-4">
                <p className="font-semibold">{row.name}</p>
                <p className="display-type mt-1 text-2xl text-brand">{row.days}</p>
                <p className="mt-2 text-sm text-muted-foreground">{row.text}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="holy-days" title={c.holyDays.title}>
          {c.holyDays.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Section>

        <Section id="years" title={c.years.title}>
          <dl className="space-y-3">
            {c.years.items.map((item) => (
              <div key={item.term} className="rounded-lg border p-4">
                <dt className="font-semibold">{item.term}</dt>
                <dd className="mt-1 text-muted-foreground">{item.text}</dd>
              </div>
            ))}
          </dl>
          <h3 className="pt-2 font-semibold">{c.years.animalsTitle}</h3>
          <ol className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {ANIMAL_YEARS[lang].map((name, i) => (
              <li key={name} className="flex flex-col items-center rounded-lg border p-3 text-center">
                <span className="text-2xl" aria-hidden>
                  {ANIMAL_EMOJIS[i]}
                </span>
                <span className="mt-1 text-sm font-semibold">{name}</span>
                <span className="text-xs text-muted-foreground">{ANIMAL_YEARS[other][i]}</span>
              </li>
            ))}
          </ol>
          <h3 className="pt-2 font-semibold">{c.years.saksTitle}</h3>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
              <li key={digit} className="rounded-lg border px-3 py-2 text-sm">
                <span className="mr-2 font-semibold tabular-nums text-brand">{t.num(digit)}</span>
                {SAKS[lang][digit]}
              </li>
            ))}
          </ol>
        </Section>

        <Section id="new-year" title={c.newYear.title}>
          <p>{c.newYear.body}</p>
          <ol className="space-y-3">
            {c.newYear.days.map((day, i) => (
              <li key={day.term} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-accent text-sm font-semibold text-accent-foreground tabular-nums">
                  {t.num(i + 1)}
                </span>
                <div>
                  <p className="font-semibold">{day.term}</p>
                  <p className="text-muted-foreground">{day.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="reading" title={c.reading.title}>
          <p>{c.reading.body}</p>
          <p className="rounded-xl bg-accent p-4 font-semibold text-accent-foreground">{formatLunar(today, lang)}</p>
          <dl className="grid gap-2 sm:grid-cols-2">
            {c.reading.parts.map((label, i) => (
              <div key={label} className="flex items-baseline justify-between gap-4 border-b py-2 text-sm">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-semibold">{dateParts[i]}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="festivals" title={c.festivals.title}>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  {c.festivals.columns.map((col) => (
                    <th key={col} scope="col" className="px-3 py-2 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {c.festivals.rows.map((row) => (
                  <tr key={row.name}>
                    <td className="px-3 py-2 font-medium">{row.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/holidays" className={buttonVariants({ variant: "outline", size: "sm" })}>
            {c.festivals.link}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Section>

        <Section id="glossary" title={c.glossary.title}>
          <dl className="grid gap-x-8 sm:grid-cols-2">
            {c.glossary.terms.map((term) => (
              <div key={term.term} className="border-b py-3">
                <dt className="font-semibold">
                  <span lang="km">{term.term}</span>
                  {term.romanized && <span className="ml-2 text-sm font-normal text-muted-foreground">{term.romanized}</span>}
                </dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">{term.text}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </div>
  )
}
