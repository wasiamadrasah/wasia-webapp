"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  createClassConfigAction,
  updateClassConfigAction,
} from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FormSelect } from "@/components/admin/form-select"
import type {
  AcademicSessionRecord,
  AcademicVersionRecord,
  AcademicShiftRecord,
  ClassRecord,
  SectionRecord,
  GroupRecord,
  AcademicClassroomRecord,
} from "@/lib/db"

interface ClassConfigFormProps {
  sessions: AcademicSessionRecord[]
  versions: AcademicVersionRecord[]
  shifts: AcademicShiftRecord[]
  classes: ClassRecord[]
  sections: SectionRecord[]
  groups: GroupRecord[]
  teachers: { id: string; name: string }[]
  classrooms: AcademicClassroomRecord[]
  configId?: string
  defaultValues?: {
    session_id?: string
    version_id?: string | null
    shift_id?: string | null
    class_id?: string
    section_id?: string | null
    group_id?: string | null
    class_teacher_id?: string | null
    classroom_id?: string | null
    capacity?: number | null
    is_active?: boolean
  }
}

export function ClassConfigForm({
  sessions,
  versions,
  shifts,
  classes,
  sections,
  groups,
  teachers,
  classrooms,
  configId,
  defaultValues,
}: ClassConfigFormProps) {
  const searchParams = useSearchParams()
  const [isActive, setIsActive] = React.useState<boolean>(
    defaultValues?.is_active ?? true
  )

  const errorMsg = searchParams.get("message")
  const status = searchParams.get("status")

  const action = configId
    ? updateClassConfigAction.bind(null, configId)
    : createClassConfigAction

  const sessionOptions = React.useMemo(
    () =>
      sessions.map((s) => ({
        value: s.id,
        label: `${s.name}${s.is_active ? " (Active)" : ""}`,
      })),
    [sessions]
  )

  const classOptions = React.useMemo(
    () =>
      classes
        .filter((c) => c.is_active || c.id === defaultValues?.class_id)
        .map((c) => ({
          value: c.id,
          label: c.name,
        })),
    [classes, defaultValues?.class_id]
  )

  const versionOptions = React.useMemo(
    () =>
      versions
        .filter((v) => v.is_active || v.id === defaultValues?.version_id)
        .map((v) => ({
          value: v.id,
          label: v.name,
        })),
    [versions, defaultValues?.version_id]
  )

  const shiftOptions = React.useMemo(
    () =>
      shifts
        .filter((s) => s.is_active || s.id === defaultValues?.shift_id)
        .map((s) => ({
          value: s.id,
          label: s.name,
        })),
    [shifts, defaultValues?.shift_id]
  )

  const sectionOptions = React.useMemo(
    () =>
      sections
        .filter((s) => s.is_active || s.id === defaultValues?.section_id)
        .map((s) => ({
          value: s.id,
          label: `${s.name}${s.room_no ? ` (Room ${s.room_no})` : ""}`,
        })),
    [sections, defaultValues?.section_id]
  )

  const groupOptions = React.useMemo(
    () =>
      groups
        .filter((g) => g.is_active || g.id === defaultValues?.group_id)
        .map((g) => ({
          value: g.id,
          label: g.name,
        })),
    [groups, defaultValues?.group_id]
  )

  const teacherOptions = React.useMemo(
    () =>
      teachers.map((t) => ({
        value: t.id,
        label: t.name,
      })),
    [teachers]
  )

  const classroomOptions = React.useMemo(
    () =>
      classrooms
        .filter((c) => c.is_active || c.id === defaultValues?.classroom_id)
        .map((c) => ({
          value: c.id,
          label: `${c.building_name} - ${c.name} (Cap: ${c.capacity})`,
        })),
    [classrooms, defaultValues?.classroom_id]
  )

  return (
    <div className="w-full">
      {status === "error" && errorMsg && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 px-4 py-3 text-sm text-rose-800 dark:text-rose-300 font-medium">
          {errorMsg}
        </div>
      )}

      <form action={action} className="space-y-6 rounded-xl border border-border p-6 bg-card shadow-2xs">
        <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Session (Required) */}
          <div className="space-y-1.5">
            <Label htmlFor="session_id" className="text-sm font-bold text-foreground">
              Academic Session <span className="text-rose-500">*</span>
            </Label>
            <FormSelect
              id="session_id"
              name="session_id"
              defaultValue={defaultValues?.session_id || ""}
              options={sessionOptions}
              placeholder="Select Session"
              required
            />
          </div>

          {/* Class (Required) */}
          <div className="space-y-1.5">
            <Label htmlFor="class_id" className="text-sm font-bold text-foreground">
              Class <span className="text-rose-500">*</span>
            </Label>
            <FormSelect
              id="class_id"
              name="class_id"
              defaultValue={defaultValues?.class_id || ""}
              options={classOptions}
              placeholder="Select Class"
              required
            />
          </div>

          {/* Version (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="version_id" className="text-sm font-bold text-foreground">
              Version
            </Label>
            <FormSelect
              id="version_id"
              name="version_id"
              defaultValue={defaultValues?.version_id ?? ""}
              options={versionOptions}
              placeholder="Select Version"
            />
          </div>

          {/* Shift (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="shift_id" className="text-sm font-bold text-foreground">
              Shift
            </Label>
            <FormSelect
              id="shift_id"
              name="shift_id"
              defaultValue={defaultValues?.shift_id ?? ""}
              options={shiftOptions}
              placeholder="Select Shift"
            />
          </div>

          {/* Section (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="section_id" className="text-sm font-bold text-foreground">
              Section
            </Label>
            <FormSelect
              id="section_id"
              name="section_id"
              defaultValue={defaultValues?.section_id ?? ""}
              options={sectionOptions}
              placeholder="Select Section"
            />
          </div>

          {/* Group (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="group_id" className="text-sm font-bold text-foreground">
              Group
            </Label>
            <FormSelect
              id="group_id"
              name="group_id"
              defaultValue={defaultValues?.group_id ?? ""}
              options={groupOptions}
              placeholder="Select Group"
            />
          </div>

          {/* Class Teacher (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="class_teacher_id" className="text-sm font-bold text-foreground">
              Class Teacher
            </Label>
            <FormSelect
              id="class_teacher_id"
              name="class_teacher_id"
              defaultValue={defaultValues?.class_teacher_id ?? ""}
              options={teacherOptions}
              placeholder="Select Class Teacher"
            />
          </div>

          {/* Classroom (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="classroom_id" className="text-sm font-bold text-foreground">
              Classroom
            </Label>
            <FormSelect
              id="classroom_id"
              name="classroom_id"
              defaultValue={defaultValues?.classroom_id ?? ""}
              options={classroomOptions}
              placeholder="Select Classroom"
            />
          </div>

          {/* Capacity (Optional) */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="capacity" className="text-sm font-bold text-foreground">
              Capacity (Seats)
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="e.g. 40"
              defaultValue={defaultValues?.capacity ?? ""}
              className="h-10 border-input bg-background"
            />
          </div>
        </div>

        {/* Status Switch */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3.5">
          <div className="space-y-0.5">
            <Label htmlFor="is_active_toggle" className="text-sm font-semibold text-foreground cursor-pointer">
              Active Configuration
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable this class combination for student admissions and scheduling.
            </p>
          </div>
          <Switch
            id="is_active_toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5"
          >
            {configId ? "Save Changes" : "Create Configuration"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/class-setup">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
