"use client"

import { usePathname } from "next/navigation"
import { useLang } from "@/components/providers"
import { cn } from "@/lib/utils"

/** Plain, crawlable links to the other language version of the current page. */
export function LangLinks() {
  const pathname = usePathname()
  const { lang, t } = useLang()

  const link = (target: "km" | "en", label: string) => (
    <a
      href={`${pathname}?lang=${target}`}
      hrefLang={target}
      lang={target}
      aria-current={lang === target ? "true" : undefined}
      className={cn("hover:text-foreground hover:underline", lang === target && "font-semibold text-foreground")}
    >
      {label}
    </a>
  )

  return (
    <nav aria-label={t.common.language} className="flex items-center gap-3 text-xs">
      {link("km", "ភាសាខ្មែរ")}
      <span aria-hidden>·</span>
      {link("en", "English")}
    </nav>
  )
}
