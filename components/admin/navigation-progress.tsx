"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * Thin top progress bar that fires on every pathname change.
 * Pure CSS animation — no dependencies beyond framer-motion already in the project.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    // On pathname change: start the bar
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname

      // Reset and start
      setProgress(0)
      setVisible(true)

      // Quickly jump to ~80% to simulate loading
      const t1 = setTimeout(() => setProgress(30), 20)
      const t2 = setTimeout(() => setProgress(60), 100)
      const t3 = setTimeout(() => setProgress(80), 300)

      // Complete and hide
      const t4 = setTimeout(() => setProgress(100), 500)
      const t5 = setTimeout(() => setVisible(false), 750)

      timerRef.current = t5
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
      }
    }
  }, [pathname])

  if (!visible && progress === 0) return null

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #3b82f6, #6366f1)",
          borderRadius: "0 2px 2px 0",
          boxShadow: "0 0 8px rgba(59,130,246,0.6)",
          transition: progress === 100
            ? "width 0.15s ease, opacity 0.25s ease"
            : "width 0.3s cubic-bezier(0.1,0.5,0.2,1)",
          opacity: progress === 100 && !visible ? 0 : 1,
        }}
      />
    </div>
  )
}
