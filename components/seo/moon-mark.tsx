import { BRAND_COLORS } from "@/lib/site"

/**
 * Brand mark for generated images (icons, Open Graph): an amber crescent on
 * brand blue. Inline styles only, since these render through next/og.
 */
export function MoonMark({ size, radius = 0 }: { size: number; radius?: number }) {
  const moon = Math.round(size * 0.56)
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_COLORS.blue600,
        borderRadius: radius,
      }}
    >
      <div style={{ position: "relative", width: moon, height: moon, display: "flex", overflow: "hidden", borderRadius: moon }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: moon,
            height: moon,
            borderRadius: moon,
            background: BRAND_COLORS.amber400,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -Math.round(moon * 0.1),
            left: -Math.round(moon * 0.36),
            width: moon,
            height: moon,
            borderRadius: moon,
            background: BRAND_COLORS.blue600,
          }}
        />
      </div>
    </div>
  )
}
