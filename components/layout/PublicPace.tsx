"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function isInternalNavigation(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false
  }

  const anchor = target.closest("a[href]")

  if (!(anchor instanceof HTMLAnchorElement)) {
    return false
  }

  if (anchor.target && anchor.target !== "_self") {
    return false
  }

  if (anchor.hasAttribute("download")) {
    return false
  }

  const href = anchor.getAttribute("href")

  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false
  }

  const url = new URL(anchor.href, window.location.href)

  if (url.origin !== window.location.origin) {
    return false
  }

  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const next = `${url.pathname}${url.search}${url.hash}`

  return current !== next
}

export default function PublicPace() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }, [])

  const begin = useCallback(() => {
    clearTimers()
    setActive(true)
    setProgress(8)

    timers.current.push(window.setTimeout(() => setProgress(32), 120))
    timers.current.push(window.setTimeout(() => setProgress(55), 360))
    timers.current.push(window.setTimeout(() => setProgress(72), 760))
    timers.current.push(window.setTimeout(() => setProgress(86), 1400))
  }, [clearTimers])

  const done = useCallback(() => {
    clearTimers()
    setProgress(100)
    timers.current.push(
      window.setTimeout(() => {
        setActive(false)
        setProgress(0)
      }, 220)
    )
  }, [clearTimers])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      if (isInternalNavigation(event.target)) {
        begin()
      }
    }

    const onPopState = () => {
      begin()
    }

    document.addEventListener("click", onClick, true)
    window.addEventListener("popstate", onPopState)

    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("popstate", onPopState)
      clearTimers()
    }
  }, [begin, clearTimers])

  useEffect(() => {
    if (active) {
      const timer = window.setTimeout(done, 0)
      return () => window.clearTimeout(timer)
    }
  }, [pathname, searchParams, active, done])

  return (
    <div
      className={`pace ${active ? "pace-active" : ""}`}
      aria-hidden="true"
      data-progress-text={`${Math.round(progress)}%`}
      data-progress={Math.round(progress)}
    >
      <div className="pace-progress" style={{ transform: `translate3d(${progress - 100}%, 0, 0)` }}>
        <div className="pace-progress-inner" />
      </div>
    </div>
  )
}
