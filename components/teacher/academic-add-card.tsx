"use client"

import { useState } from "react"
import { GraduationCap, Plus, X } from "lucide-react"

import { addTeacherAcademicAction } from "@/app/teacher/actions"
import { SubmitButton } from "@/components/forms/submit-button"

export function AcademicAddCard() {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <GraduationCap className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Academic form</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Click Add to enter a new qualification.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="size-4" />
          Add Qualification
        </button>
      </section>
    )
  }

  return (
    <form action={addTeacherAcademicAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <GraduationCap className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Add qualification</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Required fields are degree, institution, and year.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Cancel academic edit"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <Field label="Degree">
          <input name="degree" placeholder="B.Ed, M.Sc, BA" className={inputClass} required />
        </Field>
        <Field label="Institution">
          <input name="institution" placeholder="University or institution" className={inputClass} required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject">
            <input name="subject" placeholder="Subject" className={inputClass} />
          </Field>
          <Field label="Passing Year">
            <input name="passing_year" placeholder="2024" className={inputClass} required />
          </Field>
        </div>
        <Field label="Result">
          <input name="result" placeholder="GPA, division, or grade" className={inputClass} />
        </Field>
      </div>

      <SubmitButton idleLabel="Add Qualification" pendingLabel="Adding..." className={buttonClass} />
    </form>
  )
}

const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-slate-800"

const buttonClass =
  "mt-5 h-10 w-full rounded-md bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      {children}
    </label>
  )
}
