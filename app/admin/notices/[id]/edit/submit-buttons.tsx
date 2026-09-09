"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EditNoticeSubmitButtons() {
  const { pending } = useFormStatus()

  return (
    <div className="flex items-center gap-3 w-full">
      <Button
        type="submit"
        disabled={pending}
        className="flex-1 h-10 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-2xs gap-2 transition-colors justify-center"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span>{pending ? "Saving..." : "Save Changes"}</span>
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
