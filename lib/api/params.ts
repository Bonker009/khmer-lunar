import { ParamError } from "./respond"
import { MAX_YEAR, MIN_YEAR, parseISODate, type Lang } from "@/lib/khmer"

export function getLang(params: URLSearchParams): Lang {
  const lang = params.get("lang") ?? "km"
  if (lang !== "km" && lang !== "en") {
    throw new ParamError("`lang` must be `km` or `en`")
  }
  return lang
}

export function requireDate(params: URLSearchParams, name = "date"): string {
  const value = params.get(name)
  if (!value) throw new ParamError(`\`${name}\` is required (YYYY-MM-DD)`)
  try {
    parseISODate(value)
  } catch (err) {
    throw new ParamError(`\`${name}\`: ${(err as Error).message}`)
  }
  return value
}

export function optionalDate(params: URLSearchParams, name = "date") {
  return params.has(name) ? requireDate(params, name) : undefined
}

export function requireInt(
  params: URLSearchParams,
  name: string,
  min: number,
  max: number
): number {
  const raw = params.get(name)
  if (raw === null || raw === "") {
    throw new ParamError(`\`${name}\` is required`)
  }
  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new ParamError(`\`${name}\` must be an integer between ${min} and ${max}`)
  }
  return value
}

export function optionalInt(
  params: URLSearchParams,
  name: string,
  min: number,
  max: number
) {
  return params.has(name) ? requireInt(params, name, min, max) : undefined
}

export const requireYear = (params: URLSearchParams) =>
  requireInt(params, "year", MIN_YEAR, MAX_YEAR)

export function optionalBool(params: URLSearchParams, name: string) {
  const raw = params.get(name)
  if (raw === null || raw === "") return undefined
  if (raw === "true" || raw === "1") return true
  if (raw === "false" || raw === "0") return false
  throw new ParamError(`\`${name}\` must be \`true\` or \`false\``)
}

/** Comma-separated list whose items must all be in `allowed`. */
export function optionalList<T extends string>(params: URLSearchParams, name: string, allowed: readonly T[]) {
  const raw = params.get(name)
  if (!raw) return [] as T[]
  const items = raw.split(",").map((s) => s.trim()).filter(Boolean)
  for (const item of items) {
    if (!allowed.includes(item as T)) {
      throw new ParamError(`\`${name}\` accepts: ${allowed.join(", ")}`)
    }
  }
  return items as T[]
}
