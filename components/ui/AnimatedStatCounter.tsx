'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedStatCounterProps {
  value: number
  suffix: string
  delay?: number
}

export function AnimatedStatCounter({ value, suffix, delay = 0 }: AnimatedStatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // Skip if already animated
    if (hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          
          // Use setTimeout to respect the delay
          const delayTimer = setTimeout(() => {
            const startTime = performance.now()
            const duration = 1500 // Slightly shorter for snappier feel

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
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: '50px', // Start animation 50px before element is visible
      }
    )

    const element = document.querySelector(`[data-stat="${value}"]`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [value, delay])

  return (
    <span data-stat={value} style={{ willChange: 'contents' }}>
      {displayValue}{suffix}
    </span>
  )
}
