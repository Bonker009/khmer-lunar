"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/** Routes that use the full viewport width with a tight 8px gutter. */
const FULL_BLEED_ROUTES = ["/calendar"]

export function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const fullBleed = FULL_BLEED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  return (
    <main className={cn("w-full flex-1", fullBleed ? "p-2" : "mx-auto max-w-6xl px-4 py-8 sm:px-6")}>
      {children}
    </main>
  )
}
