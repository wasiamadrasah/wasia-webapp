"use client"

import * as React from "react"

export interface AdminThemeSettings {
  mode: "light" | "dark" | "system"
  primaryColor: string
  colorName: string
  fontFamily: string
  fontName: string
  fontSize: "compact" | "normal" | "comfortable"
  sidebarTheme: "deep-navy" | "midnight" | "slate" | "brand-tint"
  borderRadius: "small" | "default" | "rounded"
}

export const ADMIN_COLOR_PALETTES = [
  {
    id: "noble-indigo",
    name: "Noble Indigo",
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    primaryDark: "#6366F1",
    accent: "#EEF2FF",
    accentDark: "#1E1B4B",
    sidebarActive: "#4F46E5",
  },
  {
    id: "sacred-emerald",
    name: "Sacred Emerald",
    primary: "#059669",
    primaryHover: "#047857",
    primaryDark: "#10B981",
    accent: "#ECFDF5",
    accentDark: "#064E3B",
    sidebarActive: "#059669",
  },
  {
    id: "serene-teal",
    name: "Serene Teal",
    primary: "#0D9488",
    primaryHover: "#0F766E",
    primaryDark: "#14B8A6",
    accent: "#F0FDFA",
    accentDark: "#134E4A",
    sidebarActive: "#0D9488",
  },
  {
    id: "royal-blue",
    name: "Royal Blue",
    primary: "#1D4ED8",
    primaryHover: "#1E40AF",
    primaryDark: "#3B82F6",
    accent: "#EFF6FF",
    accentDark: "#1E3A8A",
    sidebarActive: "#1D4ED8",
  },
  {
    id: "heritage-maroon",
    name: "Heritage Maroon",
    primary: "#9F1239",
    primaryHover: "#881337",
    primaryDark: "#E11D48",
    accent: "#FFF1F2",
    accentDark: "#4C0519",
    sidebarActive: "#9F1239",
  },
]

export interface AdminFontOption {
  id: string
  name: string
  family: string
  description?: string
  googleFont?: string
  cssUrl?: string
}

export const ADMIN_FONT_OPTIONS: AdminFontOption[] = [
  {
    id: "inter",
    name: "Inter",
    family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Clean, highly readable",
    googleFont: "Inter:wght@300;400;500;600;700",
  },
  {
    id: "outfit",
    name: "Outfit",
    family: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Modern, slightly playful",
    googleFont: "Outfit:wght@300;400;500;600;700",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    family: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Premium, polished",
    googleFont: "Plus+Jakarta+Sans:wght@400;500;600;700;800",
  },
  {
    id: "manrope",
    name: "Manrope",
    family: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Modern, geometric",
    googleFont: "Manrope:wght@300;400;500;600;700;800",
  },
  {
    id: "ibm-plex",
    name: "IBM Plex Sans",
    family: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Professional, institutional",
    googleFont: "IBM+Plex+Sans:wght@300;400;500;600;700",
  },
  {
    id: "noto-sans",
    name: "Noto Sans",
    family: "'Noto Sans', 'Noto Sans Bengali', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Excellent multilingual support",
    googleFont: "Noto+Sans:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700",
  },
  {
    id: "siyam-rupali",
    name: "Siyam Rupali",
    family: "'Siyam Rupali', 'SiyamRupali', 'Kalpurush', 'SolaimanLipi', -apple-system, BlinkMacSystemFont, sans-serif",
    description: "Traditional Bangla typography",
    cssUrl: "https://fonts.maateen.me/siyam-rupali/font.css",
  },
  {
    id: "kalpurush",
    name: "Kalpurush",
    family: "'Kalpurush', 'Siyam Rupali', 'SolaimanLipi', -apple-system, BlinkMacSystemFont, sans-serif",
    description: "Clean & standard Bangla typography",
    cssUrl: "https://fonts.maateen.me/kalpurush/font.css",
  },
]

export const DEFAULT_ADMIN_THEME: AdminThemeSettings = {
  mode: "system",
  primaryColor: "#4F46E5",
  colorName: "noble-indigo",
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontName: "outfit",
  fontSize: "normal",
  sidebarTheme: "deep-navy",
  borderRadius: "default",
}

interface AdminThemeContextType {
  settings: AdminThemeSettings
  updateSettings: (newSettings: Partial<AdminThemeSettings>) => void
  resetToDefaults: () => void
}

const AdminThemeContext = React.createContext<AdminThemeContextType>({
  settings: DEFAULT_ADMIN_THEME,
  updateSettings: () => {},
  resetToDefaults: () => {},
})

const STORAGE_KEY = "admin_portal_theme_settings_v1"

export function AdminSystemThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<AdminThemeSettings>(DEFAULT_ADMIN_THEME)
  const [mounted, setMounted] = React.useState(false)

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.fontName) {
          const matchedFont = ADMIN_FONT_OPTIONS.find((f) => f.id === parsed.fontName)
          if (matchedFont) {
            parsed.fontFamily = matchedFont.family
          }
        }
        setSettings((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore
    }
    setMounted(true)
  }, [])

  // Apply theme attributes and CSS variables dynamically
  React.useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Load Font stylesheet if needed
    const fontObj = ADMIN_FONT_OPTIONS.find((f) => f.id === settings.fontName)
    if (fontObj) {
      if (fontObj.googleFont) {
        const fontId = `google-font-${fontObj.id}`
        if (!document.getElementById(fontId)) {
          const link = document.createElement("link")
          link.id = fontId
          link.rel = "stylesheet"
          link.href = `https://fonts.googleapis.com/css2?family=${fontObj.googleFont}&display=swap`
          document.head.appendChild(link)
        }
      } else if (fontObj.cssUrl) {
        const fontId = `custom-font-${fontObj.id}`
        if (!document.getElementById(fontId)) {
          const link = document.createElement("link")
          link.id = fontId
          link.rel = "stylesheet"
          link.href = fontObj.cssUrl
          document.head.appendChild(link)
        }
      }
    }

    // 1. Color palette and accents
    const colorObj = ADMIN_COLOR_PALETTES.find((c) => c.id === settings.colorName) || ADMIN_COLOR_PALETTES[0]

    // 2. Font family
    const activeFamily = fontObj?.family || "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

    // 3. Border radius
    let radiusVal = "0.45rem"
    if (settings.borderRadius === "small") radiusVal = "0.3rem"
    else if (settings.borderRadius === "rounded") radiusVal = "0.75rem"

    // 4. Font scale
    let fontScale = "1"
    let baseFontSize = "16px"
    if (settings.fontSize === "compact") {
      fontScale = "0.92"
      baseFontSize = "14.5px"
    } else if (settings.fontSize === "comfortable") {
      fontScale = "1.06"
      baseFontSize = "17px"
    }

    // Set properties on document root
    root.style.setProperty("--primary", colorObj.primary)
    root.style.setProperty("--primary-hover", colorObj.primaryHover)
    root.style.setProperty("--primary-dark", colorObj.primaryDark)
    root.style.setProperty("--primary-foreground", "#ffffff")
    root.style.setProperty("--ring", colorObj.primary)
    root.style.setProperty("--sidebar-primary", colorObj.sidebarActive)
    root.style.setProperty("--sidebar-ring", colorObj.sidebarActive)
    root.style.setProperty("--admin-font-family", activeFamily)
    root.style.setProperty("--font-sans", activeFamily)
    root.style.setProperty("--admin-font-scale", fontScale)
    root.style.setProperty("--radius", radiusVal)

    // Inject global stylesheet to enforce across all components, portals, and light/dark modes
    let dynamicStyle = document.getElementById("admin-global-theme-styles") as HTMLStyleElement | null
    if (!dynamicStyle) {
      dynamicStyle = document.createElement("style")
      dynamicStyle.id = "admin-global-theme-styles"
      document.head.appendChild(dynamicStyle)
    }
    dynamicStyle.textContent = `
      :root, :root.light, :root.dark, body, .admin-theme, [data-admin-theme="true"] {
        --primary: ${colorObj.primary} !important;
        --primary-hover: ${colorObj.primaryHover} !important;
        --primary-dark: ${colorObj.primaryDark} !important;
        --primary-foreground: #ffffff !important;
        --ring: ${colorObj.primary} !important;
        --sidebar-primary: ${colorObj.sidebarActive} !important;
        --sidebar-ring: ${colorObj.sidebarActive} !important;
        --color-primary: ${colorObj.primary} !important;
        --color-primary-foreground: #ffffff !important;
        --color-ring: ${colorObj.primary} !important;

        --color-emerald-500: ${colorObj.primary} !important;
        --color-emerald-600: ${colorObj.primary} !important;
        --color-emerald-700: ${colorObj.primaryHover} !important;
        --color-emerald-800: ${colorObj.primaryDark} !important;
        --color-emerald-50: ${colorObj.accent} !important;
        --color-emerald-100: ${colorObj.accent} !important;
        
        --color-indigo-500: ${colorObj.primary} !important;
        --color-indigo-600: ${colorObj.primary} !important;
        --color-indigo-700: ${colorObj.primaryHover} !important;
        --color-indigo-800: ${colorObj.primaryDark} !important;
        --color-indigo-50: ${colorObj.accent} !important;
        --color-indigo-100: ${colorObj.accent} !important;

        --admin-font-family: ${activeFamily} !important;
        --font-sans: ${activeFamily} !important;
        --radius: ${radiusVal} !important;
        font-family: ${activeFamily} !important;
      }

      /* Global color utility overrides for seamless application across all pages */
      .bg-emerald-500, .bg-emerald-600, .bg-emerald-700, .bg-indigo-500, .bg-indigo-600, .bg-indigo-700 {
        background-color: ${colorObj.primary} !important;
      }
      .hover\\:bg-emerald-600:hover, .hover\\:bg-emerald-700:hover, .hover\\:bg-emerald-800:hover,
      .hover\\:bg-indigo-600:hover, .hover\\:bg-indigo-700:hover, .hover\\:bg-indigo-800:hover {
        background-color: ${colorObj.primaryHover} !important;
      }
      .text-emerald-500, .text-emerald-600, .text-emerald-700, .text-indigo-500, .text-indigo-600, .text-indigo-700 {
        color: ${colorObj.primary} !important;
      }
      .border-emerald-500, .border-emerald-600, .border-emerald-700, .border-indigo-500, .border-indigo-600, .border-indigo-700 {
        border-color: ${colorObj.primary} !important;
      }
      .hover\\:text-emerald-500:hover, .hover\\:text-emerald-600:hover, .hover\\:text-emerald-700:hover,
      .hover\\:text-indigo-500:hover, .hover\\:text-indigo-600:hover, .hover\\:text-indigo-700:hover {
        color: ${colorObj.primary} !important;
      }
      .bg-emerald-50, .bg-emerald-100, .bg-indigo-50, .bg-indigo-100 {
        background-color: ${colorObj.accent} !important;
      }
      .hover\\:bg-emerald-50:hover, .hover\\:bg-emerald-100:hover,
      .hover\\:bg-indigo-50:hover, .hover\\:bg-indigo-100:hover {
        background-color: ${colorObj.accent} !important;
      }
      /* Arbitrary hex & legacy class dynamic remapping */
      .bg-\[\#4F46E5\], .bg-\[\#059669\], .bg-\[\#1D4ED8\], .bg-\[\#0D9488\], .bg-\[\#9F1239\],
      .bg-\[\#4338CA\], .bg-\[\#047857\], .bg-\[\#1E40AF\], .bg-\[\#0F766E\], .bg-\[\#881337\] {
        background-color: ${colorObj.primary} !important;
      }
      .hover\\:bg-\[\#4338CA\]:hover, .hover\\:bg-\[\#047857\]:hover, .hover\\:bg-\[\#1E40AF\]:hover,
      .hover\\:bg-\[\#0F766E\]:hover, .hover\\:bg-\[\#881337\]:hover {
        background-color: ${colorObj.primaryHover} !important;
      }
      .text-\[\#4F46E5\], .text-\[\#059669\], .text-\[\#1D4ED8\], .text-\[\#0D9488\], .text-\[\#9F1239\] {
        color: ${colorObj.primary} !important;
      }
      .border-\[\#4F46E5\], .border-\[\#059669\], .border-\[\#1D4ED8\], .border-\[\#0D9488\], .border-\[\#9F1239\],
      .border-\[\#C7D2FE\], .border-\[\#A7F3D0\], .border-\[\#BAE6FD\], .border-\[\#99F6E4\], .border-\[\#FECDD3\] {
        border-color: ${colorObj.primary} !important;
      }
      .bg-\[\#EEF2FF\], .bg-\[\#ECFDF5\], .bg-\[\#EFF6FF\], .bg-\[\#F0FDFA\], .bg-\[\#FFF1F2\] {
        background-color: ${colorObj.accent} !important;
      }
      .hover\\:bg-\[\#EEF2FF\]:hover, .hover\\:bg-\[\#ECFDF5\]:hover, .hover\\:bg-\[\#EFF6FF\]:hover {
        background-color: ${colorObj.accent} !important;
      }

      .border-emerald-200, .border-emerald-300, .border-indigo-200, .border-indigo-300 {
        border-color: ${colorObj.accent} !important;
      }

      /* Sidebar Active & Hover Styling with Theme Primary Color */
      [data-slot="sidebar"] [data-active="true"],
      [data-sidebar="sidebar"] [data-active="true"],
      [data-slot="sidebar-inner"] [data-active="true"],
      [data-sidebar="menu-button"][data-active="true"],
      [data-slot="sidebar-menu-button"][data-active="true"],
      [data-slot="sidebar-menu-sub-button"][data-active="true"],
      [data-sidebar="menu-sub-button"][data-active="true"],
      button[data-sidebar="menu-button"][data-active="true"],
      a[data-sidebar="menu-button"][data-active="true"],
      a[data-slot="sidebar-menu-sub-button"][data-active="true"] {
        background-color: ${colorObj.primary} !important;
        color: #ffffff !important;
        font-weight: 600 !important;
      }

      [data-slot="sidebar"] [data-active="true"]:hover,
      [data-sidebar="sidebar"] [data-active="true"]:hover,
      [data-sidebar="menu-button"][data-active="true"]:hover,
      [data-slot="sidebar-menu-button"][data-active="true"]:hover,
      [data-slot="sidebar-menu-sub-button"][data-active="true"]:hover {
        background-color: ${colorObj.primaryHover} !important;
        color: #ffffff !important;
      }

      [data-slot="sidebar"] [data-active="true"] svg,
      [data-sidebar="sidebar"] [data-active="true"] svg,
      [data-sidebar="menu-button"][data-active="true"] svg,
      [data-slot="sidebar-menu-button"][data-active="true"] svg,
      [data-slot="sidebar-menu-sub-button"][data-active="true"] svg {
        color: #ffffff !important;
      }

      [data-slot="sidebar"],
      [data-sidebar="sidebar"],
      [data-slot="sidebar-container"],
      [data-slot="sidebar-inner"],
      .admin-theme *:not([class*="font-mono"]):not([class*="font-serif"]),
      [data-admin-theme="true"] *:not([class*="font-mono"]):not([class*="font-serif"]) {
        font-family: inherit;
      }
    `

    // Apply Sidebar Theme Variant attribute
    root.setAttribute("data-admin-sidebar", settings.sidebarTheme)
  }, [settings, mounted])

  const updateSettings = React.useCallback((newSettings: Partial<AdminThemeSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }, [])

  const resetToDefaults = React.useCallback(() => {
    setSettings(DEFAULT_ADMIN_THEME)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_THEME))
    } catch {
      // ignore
    }
  }, [])

  return (
    <AdminThemeContext.Provider value={{ settings, updateSettings, resetToDefaults }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  return React.useContext(AdminThemeContext)
}
