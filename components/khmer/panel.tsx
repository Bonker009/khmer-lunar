import { cn } from "@/lib/utils"

/**
 * Responsive section container: flat on small screens (content sits directly on
 * the page) and a raised card from the large breakpoint up.
 */
export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "min-w-0 lg:rounded-xl lg:bg-card lg:p-6 lg:text-card-foreground lg:shadow-raised lg:ring-1 lg:ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

export function PanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("mb-5 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0 space-y-1">
        <h2 className="text-lg leading-snug font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
