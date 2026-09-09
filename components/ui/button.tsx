import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-background text-foreground hover:bg-muted hover:text-foreground shadow-2xs",
        ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs",
        warning: "bg-amber-600 text-white hover:bg-amber-700 shadow-xs",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        info: "bg-sky-600 text-white hover:bg-sky-700 shadow-xs",
        link: "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto",
        "soft-primary": "bg-primary/10 text-primary hover:bg-primary/20",
        "soft-success": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
        "soft-warning": "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
        "soft-danger": "bg-destructive/10 text-destructive hover:bg-destructive/20",
        "soft-info": "bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20",
      },
      size: {
        default: "h-9 px-3.5 text-sm rounded-lg",
        xs: "h-7 px-2 text-xs rounded-lg [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 text-xs rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-4 text-base rounded-lg",
        icon: "size-8 rounded-lg p-0",
        "icon-xs": "size-6 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9 rounded-lg p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
