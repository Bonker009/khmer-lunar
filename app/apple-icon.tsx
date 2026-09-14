import { ImageResponse } from "next/og"
import { MoonMark } from "@/components/seo/moon-mark"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** iOS applies its own corner mask, so the square stays square. */
export default function AppleIcon() {
  return new ImageResponse(<MoonMark size={size.width} />, size)
}
