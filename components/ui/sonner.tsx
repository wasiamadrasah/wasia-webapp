"use client"

import * as React from "react"
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration: number
}

declare global {
  interface Window {
    __digicampus_toasts?: ToastItem[]
  }
}

export type ToastOptions = number | {
  description?: React.ReactNode
  duration?: number
}

function emitToast(type: ToastType, message: string, options?: ToastOptions) {
  if (typeof window !== "undefined") {
    let msg = message
    let dur = 4000
    if (typeof options === "number") {
      dur = options
    } else if (options && typeof options === "object") {
      if (options.duration) dur = options.duration
      if (options.description && typeof options.description === "string") {
        msg = message ? `${message} — ${options.description}` : options.description
      }
    }

    const item: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message: msg,
      duration: dur,
    }

    if (!window.__digicampus_toasts) {
      window.__digicampus_toasts = []
    }
    window.__digicampus_toasts.push(item)

    window.dispatchEvent(
      new CustomEvent("digicampus:toast", {
        detail: item,
      })
    )
  }
}

export const toast = Object.assign(
  (message: string, options?: ToastOptions) => emitToast("info", message, options),
  {
    success: (message: string, options?: ToastOptions) => emitToast("success", message, options),
    error: (message: string, options?: ToastOptions) => emitToast("error", message, options),
    info: (message: string, options?: ToastOptions) => emitToast("info", message, options),
    warning: (message: string, options?: ToastOptions) => emitToast("warning", message, options),
    dismiss: () => null,
  }
)

export function Toaster({
  position = "top-right",
}: {
  position?: string
  richColors?: boolean
  closeButton?: boolean
  expand?: boolean
}) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  React.useEffect(() => {
    // 1. Drain any pending queued toasts emitted before Toaster mounted
    if (typeof window !== "undefined" && window.__digicampus_toasts && window.__digicampus_toasts.length > 0) {
      const pending = [...window.__digicampus_toasts]
      window.__digicampus_toasts = []
      setToasts((prev) => [...prev.slice(-4), ...pending])
    }

    // 2. Listen for newly emitted toasts
    function handleCustomToast(event: Event) {
      const customEvent = event as CustomEvent<ToastItem>
      if (customEvent.detail) {
        const newToast = customEvent.detail
        // Remove from pending queue if present
        if (window.__digicampus_toasts) {
          window.__digicampus_toasts = window.__digicampus_toasts.filter((t) => t.id !== newToast.id)
        }
        setToasts((prev) => {
          if (prev.some((t) => t.id === newToast.id)) return prev
          return [...prev.slice(-4), newToast]
        })
      }
    }

    window.addEventListener("digicampus:toast", handleCustomToast)
    return () => window.removeEventListener("digicampus:toast", handleCustomToast)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-[999999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((item) => (
        <SingleToast key={item.id} item={item} onDismiss={removeToast} />
      ))}
    </div>
  )
}

function SingleToast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = React.useState(false)
  const onDismissRef = React.useRef(onDismiss)
  onDismissRef.current = onDismiss

  const triggerDismiss = React.useCallback(() => {
    setIsExiting((alreadyExiting) => {
      if (alreadyExiting) return true
      setTimeout(() => {
        onDismissRef.current(item.id)
      }, 280)
      return true
    })
  }, [item.id])

  React.useEffect(() => {
    const duration = item.duration || 4000
    const timer = setTimeout(() => {
      triggerDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [item.id, item.duration, triggerDismiss])

  let bgStyle = "bg-blue-600 text-white shadow-blue-500/25"
  let icon = <Info className="h-5 w-5 text-white shrink-0" />

  if (item.type === "success") {
    bgStyle = "bg-[#10B981] text-white shadow-emerald-500/25"
    icon = <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
  } else if (item.type === "error") {
    bgStyle = "bg-[#EF4444] text-white shadow-rose-500/25"
    icon = <XCircle className="h-5 w-5 text-white shrink-0" />
  } else if (item.type === "warning") {
    bgStyle = "bg-[#F59E0B] text-white shadow-amber-500/25"
    icon = <AlertTriangle className="h-5 w-5 text-white shrink-0" />
  }

  const duration = item.duration || 4000

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-xl shadow-xl ${bgStyle} ${
        isExiting ? "toast-exit" : "toast-enter"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          {icon}
          <p className="text-sm font-semibold leading-snug break-words text-white">{item.message}</p>
        </div>
        <button
          onClick={triggerDismiss}
          aria-label="Close notification"
          className="rounded-lg p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Pure CSS continuous smooth decreasing progress bar */}
      <div className="h-1 w-full bg-black/15 overflow-hidden">
        <div
          className="h-full bg-white/90"
          style={{
            animationName: "toastProgress",
            animationDuration: `${duration}ms`,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
          }}
        />
      </div>
      <style jsx>{`
        .toast-enter {
          animation: toastEnter 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toast-exit {
          animation: toastExit 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes toastEnter {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes toastExit {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-16px) scale(0.92);
          }
        }
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}
