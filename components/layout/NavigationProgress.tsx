"use client"

import React, { useEffect, useState, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function ProgressContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const cleanupTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
  }

  const startProgress = () => {
    cleanupTimers()
    setVisible(true)
    setProgress(15)

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + Math.random() * 12 + 5
        if (prev < 75) return prev + Math.random() * 6 + 2
        if (prev < 90) return prev + Math.random() * 2 + 0.5
        return prev
      })
    }, 150)
  }

  // Don't show top progress bar in admin panel
  const isAdmin = pathname?.startsWith("/admin")

  const completeProgress = () => {
    cleanupTimers()
    setProgress(100)

    fadeTimeoutRef.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 280)
  }

  // Complete progress on route/search params change
  useEffect(() => {
    if (visible) {
      completeProgress()
    }
  }, [pathname, searchParams])

  // Attach global click handler for link transitions & popstate
  useEffect(() => {
    if (isAdmin) return

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest("a") as HTMLAnchorElement | null

      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      // Ignore modifiers, new tabs, downloads, external links, hashes
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        href.startsWith("#")
      ) {
        return
      }

      // Check if same origin and different URL
      try {
        const targetUrl = new URL(anchor.href, window.location.href)
        const currentUrl = new URL(window.location.href)

        if (targetUrl.origin !== currentUrl.origin) return
        if (targetUrl.pathname.startsWith("/admin")) {
          return
        }
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
          // Same page link / same search params
          return
        }

        startProgress()
      } catch {
        // invalid URL ignore
      }
    }

    const handlePopState = () => {
      startProgress()
    }

    document.addEventListener("click", handleAnchorClick, { capture: true })
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true })
      window.removeEventListener("popstate", handlePopState)
      cleanupTimers()
    }
  }, [visible, isAdmin])

  if (isAdmin || (!visible && progress === 0)) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[99999] h-[3px] overflow-hidden"
    >
      <div
        className="h-full bg-emerald-600 transition-all duration-200 ease-out shadow-[0_0_10px_#059669,0_0_5px_#10b981]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: "width, opacity",
          transitionDuration: progress === 100 ? "150ms" : "250ms",
        }}
      />
    </div>
  )
}

export default function NavigationProgress() {
  return (
    <React.Suspense fallback={null}>
      <ProgressContent />
    </React.Suspense>
  )
}
