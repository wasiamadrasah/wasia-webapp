import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-border bg-background px-3.5 py-2 text-sm !font-normal text-foreground transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:!font-normal",
        "[&:not(:disabled):not([readonly])]:hover:border-primary [&:not(:disabled):not([readonly])]:hover:ring-1 [&:not(:disabled):not([readonly])]:hover:ring-primary",
        "[&:not(:disabled):not([readonly])]:focus-visible:border-primary [&:not(:disabled):not([readonly])]:focus-visible:ring-1 [&:not(:disabled):not([readonly])]:focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:opacity-60 disabled:!font-normal",
        "read-only:pointer-events-none read-only:bg-slate-50 dark:read-only:bg-slate-900/60 read-only:text-foreground read-only:!font-normal read-only:border-border read-only:cursor-default",
        "[readonly]:pointer-events-none [readonly]:bg-slate-50 dark:[readonly]:bg-slate-900/60 [readonly]:text-foreground [readonly]:!font-normal [readonly]:border-border",
        "aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive",
        "data-[success=true]:border-emerald-600 data-[success=true]:ring-1 data-[success=true]:ring-emerald-600",
        "shadow-2xs",
        className
      )}
      {...props}
    />
  )
}

export { Input }
