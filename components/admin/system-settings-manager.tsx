"use client"

import * as React from "react"
import {
  useAdminTheme,
  ADMIN_COLOR_PALETTES,
  ADMIN_FONT_OPTIONS,
} from "@/components/admin/admin-system-theme-provider"
import {
  IconCheck,
  IconPalette,
  IconTypography,
  IconAdjustmentsHorizontal,
  IconDeviceFloppy,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/sonner"

type SettingTab = "theme" | "typography"

export function SystemSettingsManager() {
  const [activeTab, setActiveTab] = React.useState<SettingTab>("theme")
  const { settings, updateSettings } = useAdminTheme()

  // Staged / Pending states
  const [selectedColor, setSelectedColor] = React.useState(settings.colorName)
  const [selectedFont, setSelectedFont] = React.useState(settings.fontName)
  const [selectedFontSize, setSelectedFontSize] = React.useState(settings.fontSize)
  const [isSaving, setIsSaving] = React.useState(false)

  // Sync with global settings when loaded
  React.useEffect(() => {
    setSelectedColor(settings.colorName)
    setSelectedFont(settings.fontName)
    setSelectedFontSize(settings.fontSize)
  }, [settings.colorName, settings.fontName, settings.fontSize])

  // Preload font stylesheets so preview buttons render with actual font faces
  React.useEffect(() => {
    ADMIN_FONT_OPTIONS.forEach((font) => {
      if (font.googleFont) {
        const id = `google-font-${font.id}`
        if (!document.getElementById(id)) {
          const link = document.createElement("link")
          link.id = id
          link.rel = "stylesheet"
          link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`
          document.head.appendChild(link)
        }
      } else if (font.cssUrl) {
        const id = `custom-font-${font.id}`
        if (!document.getElementById(id)) {
          const link = document.createElement("link")
          link.id = id
          link.rel = "stylesheet"
          link.href = font.cssUrl
          document.head.appendChild(link)
        }
      }
    })
  }, [])

  const hasThemeChanges = selectedColor !== settings.colorName
  const hasTypographyChanges =
    selectedFont !== settings.fontName || selectedFontSize !== settings.fontSize

  const handleSaveTheme = () => {
    setIsSaving(true)
    const palette = ADMIN_COLOR_PALETTES.find((c) => c.id === selectedColor)
    if (palette) {
      updateSettings({
        colorName: selectedColor,
        primaryColor: palette.primary,
      })
    }
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Theme settings applied successfully!")
    }, 200)
  }

  const handleSaveTypography = () => {
    setIsSaving(true)
    const font = ADMIN_FONT_OPTIONS.find((f) => f.id === selectedFont)
    if (font) {
      updateSettings({
        fontName: selectedFont,
        fontFamily: font.family,
        fontSize: selectedFontSize,
      })
    }
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Typography settings applied successfully!")
    }, 200)
  }

  const activeColor =
    ADMIN_COLOR_PALETTES.find((c) => c.id === selectedColor) || ADMIN_COLOR_PALETTES[0]
  const activeFont =
    ADMIN_FONT_OPTIONS.find((f) => f.id === selectedFont) || ADMIN_FONT_OPTIONS[0]

  const navItems = [
    {
      id: "theme" as SettingTab,
      label: "Theme",
      icon: IconPalette,
    },
    {
      id: "typography" as SettingTab,
      label: "Typography",
      icon: IconTypography,
    },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
      {/* Column 1: Vertical Navigation Menu */}
      <div className="w-full md:w-52 lg:w-60 shrink-0">
        <div className="flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden divide-y divide-border/70 shadow-xs">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "hover:bg-muted/60 text-foreground font-medium bg-card hover:text-primary"
                }`}
              >
                <Icon className={`size-4.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Column 2: Content Area */}
      <div className="flex-1 min-w-0">
        {/* TAB 1: THEME */}
        {activeTab === "theme" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Primary Color Palette Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconPalette className="size-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Select Backend Theme</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Pick the primary accent color applied across buttons, badges, links, and sidebar highlights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ADMIN_COLOR_PALETTES.map((palette) => {
                    const isSelected = selectedColor === palette.id
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setSelectedColor(palette.id)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                            : "border-border/70 hover:border-border hover:bg-muted/30"
                        }`}
                      >
                        <span
                          className="size-6 rounded-full shrink-0 shadow-xs flex items-center justify-center text-white"
                          style={{ backgroundColor: palette.primary }}
                        >
                          {isSelected && <IconCheck className="size-3.5 stroke-[3]" />}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">
                            {palette.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {palette.primary}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-end border-t border-border/60">
                <Button
                  onClick={handleSaveTheme}
                  disabled={isSaving}
                  className="gap-2 text-xs h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                >
                  <IconDeviceFloppy className="size-4" />
                  <span>{hasThemeChanges ? "Save & Apply Changes" : "Save Changes"}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY */}
        {activeTab === "typography" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconTypography className="size-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Select Backend Typography</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Select the font family and interface density for all admin headings, tables, forms, and controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1. Font Family Selection */}
                <div>
                  <label className="text-xs font-semibold text-foreground mb-3 block">
                    Font Family
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ADMIN_FONT_OPTIONS.map((font) => {
                      const isSelected = selectedFont === font.id
                      return (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => setSelectedFont(font.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                              : "border-border/70 hover:border-border hover:bg-muted/30"
                          }`}
                        >
                          <span
                            className="text-sm font-normal text-foreground truncate"
                            style={{ fontFamily: font.family }}
                          >
                            {font.name}
                          </span>
                          {isSelected && (
                            <span className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] shrink-0 ml-2">
                              <IconCheck className="size-2.5" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Interface Density & Scaling */}
                <div className="pt-5 border-t border-border/60">
                  <label className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <IconAdjustmentsHorizontal className="size-3.5 text-primary" />
                    <span>Interface Density & Font Scale</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "compact" as const, label: "Compact (93%)", desc: "More content visible" },
                      { id: "normal" as const, label: "Standard (100%)", desc: "Default balanced scale" },
                      { id: "comfortable" as const, label: "Large (106%)", desc: "Maximum readability" },
                    ].map((size) => {
                      const isSelected = selectedFontSize === size.id
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedFontSize(size.id)}
                          className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary font-semibold"
                              : "border-border/70 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="text-xs font-bold">{size.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{size.desc}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-end border-t border-border/60">
                <Button
                  onClick={handleSaveTypography}
                  disabled={isSaving}
                  className="gap-2 text-xs h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                >
                  <IconDeviceFloppy className="size-4" />
                  <span>{hasTypographyChanges ? "Save & Apply Changes" : "Save Changes"}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
