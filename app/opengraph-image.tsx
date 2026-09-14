import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { MoonMark } from "@/components/seo/moon-mark"
import { BRAND_COLORS } from "@/lib/site"

export const alt = "ប្រតិទិនចន្ទគតិ · Khmer Lunar Calendar"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Shared social preview, rendered with the brand immersive surface.
 * Latin text only: next/og can't shape Khmer subscript consonants (e.g. ប្រ, ន្ទ),
 * so Khmer would render incorrectly. The Khmer name lives in the alt text.
 */
export default async function OpengraphImage() {
  const dangrek = await readFile(join(process.cwd(), "assets/fonts/Dangrek-Regular.ttf"))

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `linear-gradient(135deg, ${BRAND_COLORS.blue700}, ${BRAND_COLORS.blue600})`,
          color: "white",
          fontFamily: "Dangrek",
        }}
      >
        <MoonMark size={120} radius={28} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 96, lineHeight: 1.1 }}>Khmer Lunar Calendar</div>
          <div style={{ fontSize: 40, color: BRAND_COLORS.amber400 }}>Chanthakati · Cambodia</div>
          <div style={{ fontSize: 30, color: BRAND_COLORS.blue100 }}>
            Lunar dates · Holy days · Holidays · Khmer New Year · Free API
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Dangrek", data: dangrek, style: "normal", weight: 400 }] }
  )
}
