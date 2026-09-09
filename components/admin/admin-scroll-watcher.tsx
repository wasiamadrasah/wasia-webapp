"use client"

import { useEffect } from "react"

export function AdminScrollWatcher() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = (event: Event) => {
      const target = event.target as any
      const mainEl = document.querySelector("main.admin-main-scroll") as HTMLElement | null

      if (mainEl && (target === mainEl || target === document || target === document.body || mainEl.contains(target as Node))) {
        mainEl.classList.add("is-scrolling")

        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          mainEl.classList.remove("is-scrolling")
        }, 1000)
      }
    }

    window.addEventListener("scroll", handleScroll, { capture: true, passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true })
      clearTimeout(timeoutId)
    }
  }, [])

  return null
}
