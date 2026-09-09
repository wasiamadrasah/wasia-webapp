"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type SubmitButtonProps = {
  idleLabel: string
  pendingLabel?: string
  className?: string
}

export function SubmitButton({ idleLabel, pendingLabel = "Saving...", className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  )
}
