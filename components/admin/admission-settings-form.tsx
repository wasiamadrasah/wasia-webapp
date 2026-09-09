"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/sonner"
import { updateAdmissionSettingsAction } from "@/app/admin/students/actions"

interface AdmissionSettings {
  enable_online_admission: boolean
  start_date: string | null
  end_date: string | null
  require_approval: boolean
  auto_roll_generation: boolean
  allowed_classes: string[] | string | null
}

interface ClassItem {
  id: string
  name: string
}

export function AdmissionSettingsForm({
  settings,
  classes,
}: {
  settings: AdmissionSettings
  classes: ClassItem[]
}) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)

  const initialAllowedClasses = React.useMemo<string[]>(() => {
    if (Array.isArray(settings.allowed_classes)) {
      return settings.allowed_classes
    }
    if (typeof settings.allowed_classes === "string") {
      try {
        const parsed = JSON.parse(settings.allowed_classes)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }, [settings.allowed_classes])

  const [enabled, setEnabled] = React.useState<boolean>(Boolean(settings.enable_online_admission))
  const [startDate, setStartDate] = React.useState<string>(settings.start_date || "")
  const [endDate, setEndDate] = React.useState<string>(settings.end_date || "")
  const [requireApproval, setRequireApproval] = React.useState<boolean>(settings.require_approval !== false)
  const [autoRoll, setAutoRoll] = React.useState<boolean>(settings.auto_roll_generation !== false)
  const [allowedClasses, setAllowedClasses] = React.useState<string[]>(initialAllowedClasses)

  const toggleClass = (classId: string) => {
    setAllowedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.set("enable_online_admission", enabled ? "true" : "false")
      formData.set("start_date", startDate)
      formData.set("end_date", endDate)
      formData.set("require_approval", requireApproval ? "true" : "false")
      formData.set("auto_roll_generation", autoRoll ? "true" : "false")

      allowedClasses.forEach((cid) => {
        formData.append("allowed_classes", cid)
      })

      await updateAdmissionSettingsAction(formData)
      toast.success("Admission settings updated successfully!")
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update admission settings."
      if (!msg.includes("NEXT_REDIRECT")) {
        toast.error(msg)
      } else {
        toast.success("Admission settings updated successfully!")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle>Online Admission Setting</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enable Online Admission */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable_online_admission" className="text-sm font-semibold text-foreground cursor-pointer">
                Enable Online Admissions
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow prospective students to apply online from the frontend.
              </p>
            </div>
            <Switch
              id="enable_online_admission"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-xs font-medium text-foreground">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-xs font-medium text-foreground">
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Approval and Roll rules */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require_approval" className="text-sm font-semibold text-foreground cursor-pointer">
                  Require Admin Review & Approval
                </Label>
                <p className="text-xs text-muted-foreground">
                  Newly submitted applications will require manual approval before enrollment.
                </p>
              </div>
              <Switch
                id="require_approval"
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto_roll_generation" className="text-sm font-semibold text-foreground cursor-pointer">
                  Auto Roll Generation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Generate the next sequential roll number automatically upon approval.
                </p>
              </div>
              <Switch
                id="auto_roll_generation"
                checked={autoRoll}
                onCheckedChange={setAutoRoll}
              />
            </div>
          </div>

          {/* Allowed classes */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div>
              <Label className="text-sm font-semibold text-foreground">
                Allowed Classes for Intake
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Check the classes that are open for online applications.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
              {classes.map((c) => {
                const isChecked = allowedClasses.includes(c.id)
                return (
                  <label
                    key={c.id}
                    htmlFor={`class_${c.id}`}
                    className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-foreground"
                  >
                    <Checkbox
                      id={`class_${c.id}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleClass(c.id)}
                      className="size-4"
                    />
                    <span>{c.name}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={isSaving}
              size="sm"
              className="h-8 px-5 text-xs font-semibold"
            >
              {isSaving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              Save Settings
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 px-4 text-xs">
              <Link href="/admin/iconfig">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
