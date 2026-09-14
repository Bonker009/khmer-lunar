import { cn } from "@/lib/utils"

/**
 * Moon drawn from the lunar day: 1 កើត is a thin waxing crescent, 15 កើត is
 * full and the last day of the month is new.
 */
export function MoonPhase({
  dayNumber,
  monthLength,
  label,
  className,
  litClassName = "fill-hero-accent",
}: {
  dayNumber: number
  monthLength: number
  label?: string
  className?: string
  litClassName?: string
}) {
  const t = (dayNumber + 1) / monthLength
  const r = 46
  const top = 50 - r
  const bottom = 50 + r
  const rx = r * Math.abs(Math.cos(2 * Math.PI * t))
  const waxing = t <= 0.5
  const outerSweep = waxing ? 1 : 0
  const innerSweep = waxing ? (t < 0.25 ? 0 : 1) : t < 0.75 ? 0 : 1
  const lit = t < 0.999
    ? `M 50 ${top} A ${r} ${r} 0 0 ${outerSweep} 50 ${bottom} A ${rx} ${r} 0 0 ${innerSweep} 50 ${top} Z`
    : null

  return (
    <svg
      viewBox="0 0 100 100"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("shrink-0", className)}
    >
      <circle cx="50" cy="50" r={r} className="fill-current opacity-15" />
      {lit && <path d={lit} className={litClassName} />}
      <circle cx="50" cy="50" r={r} className="fill-none stroke-current opacity-25" strokeWidth="1.5" />
    </svg>
  )
}
