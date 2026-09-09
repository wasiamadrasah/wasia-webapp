"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  createClassConfigAction,
  updateClassConfigAction,
} from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type {
  AcademicSessionRecord,
  AcademicVersionRecord,
  AcademicShiftRecord,
  ClassRecord,
  SectionRecord,
  GroupRecord,
  AcademicClassroomRecord,
} from "@/lib/db"

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isActive, setIsActive] = React.useState<boolean>(
    defaultValues?.is_active ?? true
  )

  const errorMsg = searchParams.get("message")
  const status = searchParams.get("status")

  const action = configId
    ? updateClassConfigAction.bind(null, configId)
    : createClassConfigAction

  return (
    <div className="w-full">
      {status === "error" && errorMsg && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <form action={action} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Session (Required) */}
          <div className="space-y-2">
            <Label htmlFor="session_id">
              Academic Session <span className="text-red-500">*</span>
            </Label>
            <select
              id="session_id"
              name="session_id"
              required
              defaultValue={defaultValues?.session_id ?? ""}
              className={selectClass}
            >
              <option value="" disabled>Select Session</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.is_active ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Class (Required) */}
          <div className="space-y-2">
            <Label htmlFor="class_id">
              Class <span className="text-red-500">*</span>
            </Label>
            <select
              id="class_id"
              name="class_id"
              required
              defaultValue={defaultValues?.class_id ?? ""}
              className={selectClass}
            >
              <option value="" disabled>Select Class</option>
              {classes.filter((c) => c.is_active || c.id === defaultValues?.class_id).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Version (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="version_id">Version</Label>
            <select
              id="version_id"
              name="version_id"
              defaultValue={defaultValues?.version_id ?? ""}
              className={selectClass}
            >
              <option value="">— None —</option>
              {versions.filter((v) => v.is_active || v.id === defaultValues?.version_id).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="shift_id">Shift</Label>
            <select
              id="shift_id"
              name="shift_id"
              defaultValue={defaultValues?.shift_id ?? ""}
              className={selectClass}
            >
              <option value="">— None —</option>
              {shifts.filter((s) => s.is_active || s.id === defaultValues?.shift_id).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="section_id">Section</Label>
            <select
              id="section_id"
              name="section_id"
              defaultValue={defaultValues?.section_id ?? ""}
              className={selectClass}
            >
              <option value="">— None —</option>
              {sections.filter((s) => s.is_active || s.id === defaultValues?.section_id).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.room_no ? `(Room ${s.room_no})` : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Class Teacher (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="class_teacher_id">Class Teacher</Label>
            <select
              id="class_teacher_id"
              name="class_teacher_id"
              defaultValue={defaultValues?.class_teacher_id ?? ""}
              className={selectClass}
            >
              <option value="">— None —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Classroom (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="classroom_id">Classroom</Label>
            <select
              id="classroom_id"
              name="classroom_id"
              defaultValue={defaultValues?.classroom_id ?? ""}
              className={selectClass}
            >
              <option value="">— None —</option>
              {classrooms
                .filter((c) => c.is_active || c.id === defaultValues?.classroom_id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.building_name} - {c.name} (Cap: {c.capacity})
                  </option>
                ))}
            </select>
          </div>

          {/* Capacity (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Optional)</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="e.g. 40"
              defaultValue={defaultValues?.capacity ?? ""}
            />
          </div>
        </div>

        {/* Status Switch */}
        <div className="flex items-center gap-3 pt-2">
          <Switch
            id="is_active_toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="is_active_toggle">Active Configuration</Label>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
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
