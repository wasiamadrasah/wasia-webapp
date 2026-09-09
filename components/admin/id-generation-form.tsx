"use client"

import { useState, useTransition } from "react"
import { toast } from "@/components/ui/sonner"
import { Users, GraduationCap } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  formatPreviewID,
  type IDGenerationConfig,
  type IDGenerationSettings,
} from "@/lib/id-generation"
import { saveIDGenerationSettingsAction } from "@/app/admin/settings/id-generation/actions"

interface Props {
  initialSettings: IDGenerationSettings
}

export function IDGenerationForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState<IDGenerationSettings>(initialSettings)
  const [isPending, startTransition] = useTransition()

  const handleStaffChange = <K extends keyof IDGenerationConfig>(
    key: K,
    value: IDGenerationConfig[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      staff: {
        ...prev.staff,
        [key]: value,
      },
    }))
  }

  const handleStudentChange = <K extends keyof IDGenerationConfig>(
    key: K,
    value: IDGenerationConfig[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        [key]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const res = await saveIDGenerationSettingsAction(settings)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  const staffPreview = formatPreviewID(settings.staff)
  const studentPreview = formatPreviewID(settings.student)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─────────────────────────────────────────────────────────── */}
        {/* 1. STAFF / EMPLOYEE ID AUTO GENERATION */}
        {/* ─────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Staff ID Auto Generation</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configure automatic ID assignment for teachers and staff members upon creation.
                </p>
              </div>
              {settings.staff.auto_generation && (
                <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1 text-xs font-mono text-foreground border border-border">
                  <span className="text-muted-foreground">Preview:</span>
                  <span className="font-bold text-primary">{staffPreview}</span>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Toggle: Auto Staff ID */}
              <div className="flex items-center justify-between py-1">
                <label
                  htmlFor="auto-staff-id"
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
                  Auto Staff ID
                </label>
                <Switch
                  id="auto-staff-id"
                  checked={settings.staff.auto_generation}
                  onCheckedChange={(checked) => handleStaffChange("auto_generation", checked)}
                />
              </div>

              {/* Fields (Active only when auto generation is ON) */}
              <div className={`space-y-4 transition-opacity duration-200 ${settings.staff.auto_generation ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                
                {/* Staff ID Prefix */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Staff ID Prefix <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. EMP or E"
                    value={settings.staff.prefix}
                    onChange={(e) => handleStaffChange("prefix", e.target.value)}
                    className="h-10 text-sm bg-background border-input"
                  />
                </div>

                {/* Staff No. Digit */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Staff No. Digit <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={String(settings.staff.no_of_digits)}
                    onValueChange={(val) => handleStaffChange("no_of_digits", Number(val))}
                  >
                    <SelectTrigger className="h-10 text-sm bg-background border-input">
                      <SelectValue placeholder="Select digits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Digits (01)</SelectItem>
                      <SelectItem value="3">3 Digits (001)</SelectItem>
                      <SelectItem value="4">4 Digits (0001)</SelectItem>
                      <SelectItem value="5">5 Digits (00001)</SelectItem>
                      <SelectItem value="6">6 Digits (000001)</SelectItem>
                      <SelectItem value="8">8 Digits (00000001)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Staff ID Start From */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Staff ID Start From <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={settings.staff.start_from}
                    onChange={(e) => handleStaffChange("start_from", Math.max(1, Number(e.target.value) || 1))}
                    className="h-10 text-sm bg-background border-input"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 2. STUDENT ID AUTO GENERATION */}
        {/* ─────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>Student ID Auto Generation</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configure automatic ID assignment for admitted students across academic sessions.
                </p>
              </div>
              {settings.student.auto_generation && (
                <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1 text-xs font-mono text-foreground border border-border">
                  <span className="text-muted-foreground">Preview:</span>
                  <span className="font-bold text-primary">{studentPreview}</span>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Toggle: Auto Student ID */}
              <div className="flex items-center justify-between py-1">
                <label
                  htmlFor="auto-student-id"
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
                  Auto Student ID
                </label>
                <Switch
                  id="auto-student-id"
                  checked={settings.student.auto_generation}
                  onCheckedChange={(checked) => handleStudentChange("auto_generation", checked)}
                />
              </div>

              {/* Fields (Active only when auto generation is ON) */}
              <div className={`space-y-4 transition-opacity duration-200 ${settings.student.auto_generation ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                
                {/* Student ID Prefix */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Student ID Prefix <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. STD or S"
                    value={settings.student.prefix}
                    onChange={(e) => handleStudentChange("prefix", e.target.value)}
                    className="h-10 text-sm bg-background border-input"
                  />
                </div>

                {/* Student No. Digit */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Student No. Digit <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={String(settings.student.no_of_digits)}
                    onValueChange={(val) => handleStudentChange("no_of_digits", Number(val))}
                  >
                    <SelectTrigger className="h-10 text-sm bg-background border-input">
                      <SelectValue placeholder="Select digits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Digits (01)</SelectItem>
                      <SelectItem value="3">3 Digits (001)</SelectItem>
                      <SelectItem value="4">4 Digits (0001)</SelectItem>
                      <SelectItem value="5">5 Digits (00001)</SelectItem>
                      <SelectItem value="6">6 Digits (000001)</SelectItem>
                      <SelectItem value="8">8 Digits (00000001)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Student ID Start From */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Student ID Start From <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={settings.student.start_from}
                    onChange={(e) => handleStudentChange("start_from", Math.max(1, Number(e.target.value) || 1))}
                    className="h-10 text-sm bg-background border-input"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 font-semibold"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  )
}
