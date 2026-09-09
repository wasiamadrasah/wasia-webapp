'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedStatCounterProps {
  value: number
  suffix: string
  delay?: number
  convertBangla?: boolean
}

function toBanglaDigits(val: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(val).replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)] || digit)
}

export function AnimatedStatCounter({
  value,
  suffix,
  delay = 0,
  convertBangla = true,
}: AnimatedStatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Skip if already animated
    if (hasAnimated.current) return

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          
          // Use setTimeout to respect the delay
          const delayTimer = setTimeout(() => {
            const startTime = performance.now()
            const duration = 1600 // Smooth duration for natural feel

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)
              
              // Ease-out-cubic for natural feel
              const eased = 1 - Math.pow(1 - progress, 3)
              setDisplayValue(Math.round(value * eased))

              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }

            requestAnimationFrame(animate)
          }, delay)

          return () => clearTimeout(delayTimer)
        }
      },
      {
        threshold: 0.3,
        rootMargin: '50px',
      }
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
    }
  }, [value, delay])

  const formattedValue = convertBangla ? toBanglaDigits(displayValue) : displayValue
  const formattedSuffix = convertBangla ? toBanglaDigits(suffix) : suffix

  return (
    <span ref={containerRef} style={{ willChange: 'contents' }}>
      {formattedValue}{formattedSuffix}
    </span>
  )
}
