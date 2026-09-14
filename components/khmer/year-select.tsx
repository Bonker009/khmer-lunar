"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useLang } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MAX_YEAR, MIN_YEAR } from "@/lib/khmer/constants"

const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i)

export function YearSelect({ value, onChange }: { value: number; onChange: (year: number) => void }) {
  const { t } = useLang()
  const items = useMemo(() => Object.fromEntries(YEARS.map((y) => [String(y), t.num(y)])), [t])

  return (
    <Select value={String(value)} items={items} onValueChange={(v) => v && onChange(Number(v))}>
      <SelectTrigger size="sm" className="w-24" aria-label={t.common.year}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {YEARS.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {t.num(y)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Previous / year picker / next, navigating to `${path}/${year}`. */
export function YearNav({ year, path }: { year: number; path: string }) {
  const { t } = useLang()
  const router = useRouter()
  const go = (y: number) => router.push(`${path}/${y}`)

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" aria-label={t.common.previous} disabled={year <= MIN_YEAR} onClick={() => go(year - 1)}>
        <ChevronLeftIcon />
      </Button>
      <YearSelect value={year} onChange={go} />
      <Button variant="outline" size="icon-sm" aria-label={t.common.next} disabled={year >= MAX_YEAR} onClick={() => go(year + 1)}>
        <ChevronRightIcon />
      </Button>
    </div>
  )
}
