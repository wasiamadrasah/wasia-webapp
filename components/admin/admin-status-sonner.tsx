"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/sonner"

export function AdminStatusSonner() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const processedParamsRef = useRef<string>("")

  useEffect(() => {
    let status = searchParams.get("status")
    let message = searchParams.get("message")

    // Fallback to window.location.search if Next.js searchParams hydration is pending
    if (typeof window !== "undefined" && (!status || !message)) {
      const windowParams = new URLSearchParams(window.location.search)
      status = windowParams.get("status") || status
      message = windowParams.get("message") || message
    }

    if (!status || !message) {
      return
    }

    const isProfileEditPage = /^\/admin\/(teachers|staffs)\/[^/]+\/edit$/.test(pathname)
    const paramKey = `${status}:${message}`
    if (processedParamsRef.current === paramKey) {
      return
    }

    processedParamsRef.current = paramKey

    const lowerMsg = message.toLowerCase()
    const isDeleteMsg = lowerMsg.includes("deleted") || lowerMsg.includes("removed") || lowerMsg.includes("delete")

    if (status === "success") {
      if (isDeleteMsg) {
        toast.error(message)
      } else {
        toast.success(message)
      }
    } else if (status === "error") {
      toast.error(message)
    } else if (status === "warning") {
      toast.warning(message)
    } else {
      toast(message)
    }

    // Keep params on profile edit error pages so inline field errors remain visible.
    if (isProfileEditPage && status === "error") {
      return
    }

    // Delay url cleanup slightly so React and Sonner finish rendering the toast
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const newParams = new URLSearchParams(window.location.search)
        newParams.delete("status")
        newParams.delete("message")
        const newUrl = newParams.toString()
          ? `${window.location.pathname}?${newParams.toString()}`
          : window.location.pathname
        window.history.replaceState(null, "", newUrl)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchParams, pathname])

  return null
}
