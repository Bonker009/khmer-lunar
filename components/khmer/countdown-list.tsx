"use client"

import { useLang } from "@/components/providers"
import { Badge } from "@/components/ui/badge"
import type { CountdownEventView } from "@/lib/api/views"
import { formatGregorian } from "@/lib/khmer/format"

export function CountdownList({ events }: { events: CountdownEventView[] }) {
  const { t, lang } = useLang()

  return (
    <ul className="divide-y">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className="truncate font-medium">{event.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {formatGregorian(event.date, lang)} · {event.lunar}
            </p>
          </div>
          <Badge variant={event.daysUntil === 0 ? "default" : "secondary"} className="shrink-0 tabular-nums">
            {t.common.inDays(event.daysUntil)}
          </Badge>
        </li>
      ))}
    </ul>
  )
}
