import { ImageResponse } from "next/og"
import { MoonMark } from "@/components/seo/moon-mark"

/** Favicon (32px, rounded) plus the 192/512px PWA icons (square, safe for masking). */
export function generateImageMetadata() {
  return [32, 192, 512].map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }))
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id)
  return new ImageResponse(<MoonMark size={size} radius={size <= 32 ? Math.round(size * 0.22) : 0} />, {
    width: size,
    height: size,
  })
}
