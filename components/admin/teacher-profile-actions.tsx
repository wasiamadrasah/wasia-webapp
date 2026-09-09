"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"

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

type TeacherProfileActionsProps = {
  teacherId: string
}

export function TeacherProfileActions({ teacherId }: TeacherProfileActionsProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2.5">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="h-10 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2 transition-colors">
            <Pencil className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              <Pencil className="h-5 w-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Open profile edit mode?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to edit this teacher profile. Would you like to continue to the profile editor?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push(`/admin/teachers/${teacherId}/edit`)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button asChild variant="outline" className="h-10 rounded-lg border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
        <Link href="/admin/teachers">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <span>Back to Teachers</span>
        </Link>
      </Button>
    </div>
  )
}
