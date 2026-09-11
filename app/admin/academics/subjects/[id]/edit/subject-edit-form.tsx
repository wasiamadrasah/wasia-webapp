"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { updateSubjectAction } from "@/app/admin/academics/actions"
import type { SubjectRecord } from "@/lib/db"
import { PageHeader } from "@/components/digicampus/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SubjectEditForm({ subject }: { subject: SubjectRecord }) {
  const [isActive, setIsActive] = useState<boolean>(subject.is_active)

  const boundAction = updateSubjectAction.bind(null, subject.id)

  return (
    <div className="w-full max-w-2xl space-y-6">
      <PageHeader
        title="Edit Subject"
        description={`Update subject details for "${subject.name}".`}
        action={
          <Button asChild variant="outline" className="h-10 border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href="/admin/academics/subjects">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to Subjects</span>
            </Link>
          </Button>
        }
      />

      <form action={boundAction} className="space-y-6 rounded-xl border border-border p-6 bg-card shadow-2xs">
        {/* Hidden active field */}
        <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-bold text-foreground">
              Subject Name (English) <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={subject.name}
              placeholder="e.g. Mathematics"
              className="h-10 text-sm border-input bg-background"
            />
          </div>

          {/* Name (Bangla) */}
          <div className="space-y-1.5">
            <Label htmlFor="name_bn" className="text-sm font-bold text-foreground">
              Subject Name (Bangla)
            </Label>
            <Input
              id="name_bn"
              name="name_bn"
              defaultValue={subject.name_bn ?? ""}
              placeholder="e.g. গণিত"
              className="h-10 text-sm border-input bg-background font-bensen"
            />
          </div>

          {/* Code */}
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-sm font-bold text-foreground">
              Subject Code <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              required
              defaultValue={subject.code}
              placeholder="e.g. MATH"
              className="h-10 text-sm border-input bg-background uppercase"
            />
            <p className="text-muted-foreground text-xs">Will be auto-uppercased on save.</p>
          </div>

          {/* Active switch */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3.5 mt-2">
            <div className="space-y-0.5">
              <Label htmlFor="is_active_switch" className="text-sm font-semibold text-foreground cursor-pointer">
                Active Subject
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable this subject for class syllabus and teacher assignments.
              </p>
            </div>
            <Switch
              id="is_active_switch"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5">
            Save Changes
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/academics/subjects">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
