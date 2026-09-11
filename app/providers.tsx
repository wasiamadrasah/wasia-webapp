"use client"

import * as React from "react"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"

type Theme = "dark" | "light" | "system"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeProviderContext = React.createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
})

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme-preference",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light")

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let activeTheme: "dark" | "light" = "light"
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      activeTheme = theme
    }

    root.classList.add(activeTheme)
    setResolvedTheme(activeTheme)
  }, [theme])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
    },
    [storageKey]
  )

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

import { AdminSystemThemeProvider } from "@/components/admin/admin-system-theme-provider"

export const useTheme = () => React.useContext(ThemeProviderContext)

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <AdminSystemThemeProvider>
        <ThemeProvider defaultTheme="system" storageKey="theme-preference">
          {children}
          <Toaster position="top-right" richColors closeButton expand={true} />
        </ThemeProvider>
      </AdminSystemThemeProvider>
    </SessionProvider>
  )
}
