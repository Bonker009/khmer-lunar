"use client"

import { ArrowRightLeftIcon, Loader2Icon } from "lucide-react"
import { useState } from "react"
import { useLang } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { apiGet } from "@/lib/api/client"
import { LUNAR_MONTHS, PHASES } from "@/lib/khmer/constants"
import type { SerializedLunarDate } from "@/lib/khmer/format"
import { LunarDetails } from "./lunar-details"

// Order months as they appear in a lunar year, with the leap Asadh pair after Jesth.
const MONTH_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 12, 13, 8, 9, 10, 11]

export function DateConverter({ initial }: { initial: SerializedLunarDate }) {
  const { t, lang } = useLang()

  const [date, setDate] = useState(initial.date)
  const [toLunar, setToLunar] = useState<SerializedLunarDate>(initial)
  const [toLunarError, setToLunarError] = useState<string | null>(null)
  const [toLunarLoading, setToLunarLoading] = useState(false)

  const [be, setBe] = useState(String(initial.year.buddhistEra))
  const [month, setMonth] = useState(String(initial.lunar.month.index))
  const [day, setDay] = useState(String(initial.lunar.day))
  const [phase, setPhase] = useState<string>(initial.lunar.phase)
  const [toSolar, setToSolar] = useState<SerializedLunarDate | null>(initial)
  const [toSolarError, setToSolarError] = useState<string | null>(null)
  const [toSolarLoading, setToSolarLoading] = useState(false)

  async function convertToLunar(value: string) {
    setDate(value)
    if (!value) return
    setToLunarLoading(true)
    try {
      setToLunar(await apiGet<SerializedLunarDate>("/api/v1/convert", { date: value, lang }))
      setToLunarError(null)
    } catch (err) {
      setToLunarError((err as Error).message)
    } finally {
      setToLunarLoading(false)
    }
  }

  async function convertToSolar(event: React.FormEvent) {
    event.preventDefault()
    setToSolarLoading(true)
    try {
      setToSolar(await apiGet<SerializedLunarDate>("/api/v1/convert/reverse", { be, month, day, phase, lang }))
      setToSolarError(null)
    } catch (err) {
      setToSolar(null)
      setToSolarError((err as Error).message)
    } finally {
      setToSolarLoading(false)
    }
  }

  const monthItems = Object.fromEntries(MONTH_ORDER.map((i) => [String(i), LUNAR_MONTHS[lang][i]]))
  const dayItems = Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), t.num(i + 1)]))

  return (
    <Tabs defaultValue="to-lunar">
      <TabsList>
        <TabsTrigger value="to-lunar">{t.convert.toLunar}</TabsTrigger>
        <TabsTrigger value="to-solar">{t.convert.toSolar}</TabsTrigger>
      </TabsList>

      <TabsContent value="to-lunar" className="mt-4">
        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{t.common.solar}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="gregorian-date">{t.common.date}</Label>
              <Input
                id="gregorian-date"
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                value={date}
                onChange={(e) => convertToLunar(e.target.value)}
              />
            </CardContent>
          </Card>
          <ResultCard title={t.convert.result} loading={toLunarLoading} error={toLunarError} data={toLunar} />
        </div>
      </TabsContent>

      <TabsContent value="to-solar" className="mt-4">
        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{t.common.lunar}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={convertToSolar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="be-year">{t.convert.beYear}</Label>
                  <Input id="be-year" type="number" min={2443} max={2645} value={be} onChange={(e) => setBe(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.lunar.lunarMonth}</Label>
                  <Select value={month} items={monthItems} onValueChange={(v) => v && setMonth(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_ORDER.map((i) => (
                        <SelectItem key={i} value={String(i)}>
                          {LUNAR_MONTHS[lang][i]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="space-y-2">
                    <Label>{t.lunar.lunarDay}</Label>
                    <Select value={day} items={dayItems} onValueChange={(v) => v && setDay(v)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(dayItems).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ToggleGroup
                    aria-label={t.lunar.phase}
                    variant="outline"
                    spacing={0}
                    value={[phase]}
                    onValueChange={(v) => v[0] && setPhase(v[0])}
                  >
                    <ToggleGroupItem value="kert">{PHASES[lang].kert}</ToggleGroupItem>
                    <ToggleGroupItem value="roech">{PHASES[lang].roech}</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <Button type="submit" className="w-full" disabled={toSolarLoading}>
                  {toSolarLoading ? <Loader2Icon className="animate-spin" /> : <ArrowRightLeftIcon />}
                  {t.convert.convert}
                </Button>
              </form>
            </CardContent>
          </Card>
          <ResultCard title={t.convert.result} loading={toSolarLoading} error={toSolarError} data={toSolar} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

function ResultCard({
  title,
  loading,
  error,
  data,
}: {
  title: string
  loading: boolean
  error: string | null
  data: SerializedLunarDate | null
}) {
  return (
    <Card aria-busy={loading}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {error ? (
          <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : (
          data && <LunarDetails data={data} />
        )}
      </CardContent>
    </Card>
  )
}
