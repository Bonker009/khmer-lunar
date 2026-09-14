"use client"

import { Loader2Icon, SendIcon } from "lucide-react"
import { useState } from "react"
import { useLang } from "@/components/providers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ENDPOINTS } from "@/lib/api/endpoints"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

interface ApiResponse {
  status: number
  ms: number
  body: string
}

export function ApiPlayground({ origin }: { origin: string }) {
  const { t, lang } = useLang()
  const [activeId, setActiveId] = useState("convert")
  const [values, setValues] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(
      ENDPOINTS.map((e) => [e.id, Object.fromEntries(e.params.map((p) => [p.name, p.name === "lang" ? lang : p.example]))])
    )
  )
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const endpoint = ENDPOINTS.find((e) => e.id === activeId)!
  const current = values[activeId]
  const query = new URLSearchParams(Object.entries(current).filter(([, v]) => v !== "")).toString()
  const path = `${endpoint.path}${query ? `?${query}` : ""}`
  const url = `${origin}${path}`

  const samples = {
    curl: `curl "${url}"`,
    fetch: `const res = await fetch("${url}")\nconst { data, error } = await res.json()`,
  }

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [activeId]: { ...prev[activeId], [name]: value } }))
  }

  async function send() {
    setLoading(true)
    const started = performance.now()
    try {
      const res = await fetch(path)
      const body = await res.json()
      setResponse({ status: res.status, ms: Math.round(performance.now() - started), body: JSON.stringify(body, null, 2) })
    } catch (err) {
      setResponse({ status: 0, ms: 0, body: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {ENDPOINTS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => {
              setActiveId(e.id)
              setResponse(null)
            }}
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
              e.id === activeId && "bg-accent text-accent-foreground"
            )}
          >
            <span className="block font-mono text-xs">{e.path.replace("/api/v1", "") || "/"}</span>
            <span className="hidden text-xs text-muted-foreground lg:block">{e.summary[lang]}</span>
          </button>
        ))}
      </nav>

      <div className="min-w-0 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="ghost" className="bg-observance-soft font-mono text-observance">
                GET
              </Badge>
              <CardTitle className="font-mono text-base">{endpoint.path}</CardTitle>
            </div>
            <CardDescription>{endpoint.summary[lang]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {endpoint.params.map((param) => {
                const id = `${endpoint.id}-${param.name}`
                return (
                  <div key={param.name} className="space-y-1.5">
                    <Label htmlFor={id} className="flex items-center gap-2">
                      <span className="font-mono">{param.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {param.required ? t.docs.required : t.docs.optional}
                      </span>
                    </Label>
                    {param.options ? (
                      <Select
                        value={current[param.name] ?? ""}
                        onValueChange={(v) => setValue(param.name, v ?? "")}
                      >
                        <SelectTrigger id={id} className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {param.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={id}
                        value={current[param.name] ?? ""}
                        placeholder={param.example}
                        onChange={(e) => setValue(param.name, e.target.value)}
                        className="font-mono"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">{param.description[lang]}</p>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={send} disabled={loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
                {t.docs.send}
              </Button>
              <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-2 py-1 font-mono text-xs">{path}</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.docs.examples}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl">
              <div className="flex items-center justify-between gap-2">
                <TabsList>
                  <TabsTrigger value="curl">curl</TabsTrigger>
                  <TabsTrigger value="fetch">fetch</TabsTrigger>
                </TabsList>
              </div>
              {(Object.keys(samples) as (keyof typeof samples)[]).map((key) => (
                <TabsContent key={key} value={key} className="mt-3 space-y-2">
                  <pre className="overflow-x-auto rounded-lg bg-code p-4 font-mono text-xs text-code-foreground">{samples[key]}</pre>
                  <CopyButton text={samples[key]} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{t.docs.response}</CardTitle>
              {response && (
                <>
                  <Badge variant={response.status >= 200 && response.status < 300 ? "secondary" : "destructive"} className="font-mono">
                    {response.status || "ERR"}
                  </Badge>
                  <span className="text-xs text-muted-foreground tabular-nums">{response.ms} ms</span>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {response ? (
              <pre className="max-h-[32rem] overflow-auto rounded-lg bg-code p-4 font-mono text-xs text-code-foreground">
                {response.body}
              </pre>
            ) : (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">{t.docs.empty}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
