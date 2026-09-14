"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useLang } from "@/components/providers"
import { Button } from "@/components/ui/button"

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(t.common.copied)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
      {label ?? t.common.copy}
    </Button>
  )
}
