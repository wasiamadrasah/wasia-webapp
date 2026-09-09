"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/sonner"

export function TeacherStatusSonner() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const status = searchParams.get("status")
    const message = searchParams.get("message")

    if (!status || !message) {
      return
    }

    if (status === "success") {
      toast.success(message)
    } else if (status === "error") {
      toast.error(message)
    } else {
      toast(message)
    }

    router.replace(pathname, { scroll: false })
  }, [searchParams, pathname, router])

  return null
}
