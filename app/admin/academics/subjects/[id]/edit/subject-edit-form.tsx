"use client"

import { useState } from "react"
import Link from "next/link"
import { updateSubjectAction } from "@/app/admin/academics/actions"
import type { SubjectRecord } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Field, FieldGroup } from "@/components/ui/field"

export default function SubjectEditForm({ subject }: { subject: SubjectRecord }) {
  const [isActive, setIsActive] = useState<boolean>(subject.is_active)

  const boundAction = updateSubjectAction.bind(null, subject.id)

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Subject</h1>
        <p className="text-muted-foreground mt-1">Update subject details for &ldquo;{subject.name}&rdquo;.</p>
      </div>

      <form action={boundAction} className="space-y-6">
        {/* Hidden active field */}
        <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />

        <FieldGroup>
          {/* Name */}
          <Field>
            <Label htmlFor="name">
              Subject Name (English) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={subject.name}
              placeholder="e.g. Mathematics"
            />
          </Field>

          {/* Name (Bangla) */}
          <Field>
            <Label htmlFor="name_bn">
              Subject Name (Bangla)
            </Label>
            <Input
              id="name_bn"
              name="name_bn"
              defaultValue={subject.name_bn ?? ""}
              placeholder="e.g. গণিত"
            />
          </Field>

          {/* Code */}
          <Field>
            <Label htmlFor="code">
              Subject Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              required
              defaultValue={subject.code}
              placeholder="e.g. MATH"
            />
            <p className="text-muted-foreground text-xs mt-1">Will be auto-uppercased on save.</p>
          </Field>

          {/* Active switch */}
          <Field>
            <div className="flex items-center gap-3">
              <Switch
                id="is_active_switch"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is_active_switch" className="cursor-pointer">Active</Label>
            </div>
          </Field>
        </FieldGroup>

        <div className="flex items-center gap-3">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/academics/subjects">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
