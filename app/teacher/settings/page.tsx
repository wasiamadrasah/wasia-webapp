import { KeyRound, ShieldCheck } from "lucide-react"

import { getAuthSession } from "@/lib/auth"
import { getTeacherAccountByStaffId, getTeacherProfile } from "@/lib/db"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { SubmitButton } from "@/components/forms/submit-button"
import { updateTeacherPasswordAction } from "@/app/teacher/actions"
import { TeacherEmailChangeCard } from "@/components/teacher/teacher-email-change-card"

type SettingsPageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await getAuthSession()
  const params = (await searchParams) ?? {}
  const staffId = session?.user?.id ?? ""
  const [profile, account] = await Promise.all([
    staffId ? getTeacherProfile(staffId) : null,
    staffId ? getTeacherAccountByStaffId(staffId) : null,
  ])

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Teacher Account"
        title="Account Settings"
        description="Manage sign-in email, password, and current account status."
      />

      <StatusMessage status={params.status} message={params.message} />

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Current Account</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Signed-in teacher profile</p>
            </div>
          </div>

          <dl className="mt-5 grid gap-3 text-sm">
            <InfoRow label="Name" value={profile?.full_name_en || "-"} />
            <InfoRow label="Email" value={account?.email || profile?.email || "-"} />
            <InfoRow label="Status" value={account?.status || "active"} />
            <InfoRow label="Role" value={account?.role || "teacher"} />
          </dl>

        </section>

        <TeacherEmailChangeCard currentEmail={account?.email || profile?.email || ""} />

        <form action={updateTeacherPasswordAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <KeyRound className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Change Password</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Use at least 10 characters.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="Current Password">
              <input type="password" name="current_password" placeholder="Current password" className={inputClass} required />
            </Field>
            <Field label="New Password">
              <input type="password" name="new_password" placeholder="New password" className={inputClass} required />
            </Field>
            <Field label="Confirm New Password">
              <input type="password" name="confirm_password" placeholder="Confirm new password" className={inputClass} required />
            </Field>
          </div>

          <SubmitButton idleLabel="Update Password" pendingLabel="Updating..." className={buttonClass} />
        </form>
      </div>
    </section>
  )
}

const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-slate-800"

const buttonClass =
  "mt-5 h-10 w-full rounded-md bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  )
}

function StatusMessage({ status, message }: { status?: string; message?: string }) {
  if (!message) return null
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200" : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"}`}>
      {message}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      {children}
    </label>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-950 dark:text-white">{value}</dd>
    </div>
  )
}
