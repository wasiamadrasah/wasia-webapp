"use client"

import { useEffect } from "react"

export function GlobalScrollWatcher() {
  useEffect(() => {
    const activeScrollMap = new WeakMap<Element, number>()
    let rootTimeoutId: number

    const handleScroll = (event: Event) => {
      // Disable custom scrollbar active class toggling on mobile screens (<= 768px)
      if (window.innerWidth <= 768) return

      let target = event.target as Element | Document | null
      if (!target) return

      // Mark root html and body during any scroll event
      document.documentElement.classList.add("is-scrolling")
      document.body.classList.add("is-scrolling")

      window.clearTimeout(rootTimeoutId)
      rootTimeoutId = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling")
        document.body.classList.remove("is-scrolling")
      }, 800)

      if (target === document || target === document.documentElement || target === document.body) {
        target = document.documentElement
      }

      if (target instanceof Element) {
        target.classList.add("is-scrolling")

        const existingTimer = activeScrollMap.get(target)
        if (existingTimer) {
          window.clearTimeout(existingTimer)
        }

        const timer = window.setTimeout(() => {
          target.classList.remove("is-scrolling")
          activeScrollMap.delete(target)
        }, 800)

        activeScrollMap.set(target, timer)
      }
    }

    window.addEventListener("scroll", handleScroll, { capture: true, passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true })
      window.clearTimeout(rootTimeoutId)
    }
  }, [])

  return null
}
