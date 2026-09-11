import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center text-center w-fit shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors select-none [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0 gap-1 leading-tight",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",
        primary: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",
        secondary: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0] dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700/60",
        neutral: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0] dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700/60",
        success: "bg-[#DCFCE7] text-[#166534] border-[#86EFAC] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
        warning: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
        destructive: "bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60",
        info: "bg-[#E0F2FE] text-[#075985] border-[#7DD3FC] dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60",
        outline: "bg-transparent text-foreground border-border",
        ghost: "bg-transparent text-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
