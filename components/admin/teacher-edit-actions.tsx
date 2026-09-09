"use client"

import Link from "next/link"
import { AlertTriangle, Save } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type TeacherEditActionsProps = {
  teacherId: string
  formId: string
}

export function TeacherEditActions({ teacherId, formId }: TeacherEditActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" className="h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Save teacher profile changes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update teacher information in the database. Would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const form = document.getElementById(formId) as HTMLFormElement | null
                form?.requestSubmit()
              }}
            >
              Confirm Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button asChild variant="outline" className="h-10 px-4 rounded-lg border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium">
        <Link href={`/admin/teachers/${teacherId}`}>Cancel</Link>
      </Button>
    </div>
  )
}
