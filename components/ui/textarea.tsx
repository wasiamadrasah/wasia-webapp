import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm !font-normal text-foreground transition-all outline-none placeholder:text-muted-foreground placeholder:!font-normal",
        "[&:not(:disabled):not([readonly])]:hover:border-primary [&:not(:disabled):not([readonly])]:hover:ring-1 [&:not(:disabled):not([readonly])]:hover:ring-primary",
        "[&:not(:disabled):not([readonly])]:focus-visible:border-primary [&:not(:disabled):not([readonly])]:focus-visible:ring-1 [&:not(:disabled):not([readonly])]:focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 disabled:!font-normal",
        "read-only:pointer-events-none read-only:bg-slate-50 dark:read-only:bg-slate-900/60 read-only:text-foreground read-only:!font-normal read-only:border-border read-only:cursor-default",
        "[readonly]:pointer-events-none [readonly]:bg-slate-50 dark:[readonly]:bg-slate-900/60 [readonly]:text-foreground [readonly]:!font-normal [readonly]:border-border",
        "aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive",
        "shadow-2xs",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
