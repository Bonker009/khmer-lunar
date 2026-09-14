/** Browser helper for calling our own API routes. Returns the `data` field. */
export async function apiGet<T>(path: string, params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value))
  }
  const res = await fetch(`${path}?${search}`)
  const body = await res.json()
  if (!res.ok) throw new Error(body?.error?.message ?? res.statusText)
  return body.data as T
}
