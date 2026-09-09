"use client"

import { useEffect } from "react"

/**
 * Overrides the page-level scrollbar color (on <html>) to blue
 * for the duration this component is mounted (admission portal pages).
 */
export function AdmissionScrollbarOverride() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    body.classList.add("admission-theme-active")
    const prevScrollbarColor = html.style.getPropertyValue("scrollbar-color")
    html.style.setProperty("scrollbar-color", "#2563EB transparent")

    const thumb = document.getElementById("customScrollbarThumb")
    if (thumb) {
      thumb.style.setProperty("background-color", "#2563EB", "important")
    }

    return () => {
      body.classList.remove("admission-theme-active")
      html.style.setProperty("scrollbar-color", prevScrollbarColor)
      if (thumb) {
        thumb.style.removeProperty("background-color")
      }
    }
  }, [])

  return null
}
