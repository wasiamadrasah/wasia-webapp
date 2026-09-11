"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NoticeSubmitButtons() {
  const { pending } = useFormStatus()

  return (
    <div className="flex items-center gap-3 w-full">
      <Button
        type="submit"
        disabled={pending}
        className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2 transition-colors justify-center"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span>{pending ? "Saving Notice..." : "Save Notice"}</span>
      </Button>

      <Button
        asChild={!pending}
        type="button"
        variant="outline"
        disabled={pending}
        className="h-10 px-4 rounded-lg border-border bg-white text-foreground hover:bg-muted/40 font-medium text-sm transition-colors"
      >
        {pending ? (
          <span>Cancel</span>
        ) : (
          <Link href="/admin/notices">Cancel</Link>
        )}
      </Button>
    </div>
  )
}
