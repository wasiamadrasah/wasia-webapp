import Image from "next/image"
import { CalendarDays, IdCard, Mail, Phone } from "lucide-react"

import { getAuthSession } from "@/lib/auth"
import { getTeacherProfile } from "@/lib/db"
import { ProfileEditForm } from "@/components/teacher/profile-edit-form"

type ProfilePageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getAuthSession()
  const params = (await searchParams) ?? {}
  const profile = session?.user?.id ? await getTeacherProfile(session.user.id) : null
  const displayName = profile?.full_name_en || "Teacher"
  const designation = profile?.designation || "Teacher"

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Teacher Profile"
        title="My Profile"
        description="Update the profile fields you can manage from your teacher account."
      />

      <StatusMessage status={params.status} message={params.message} />

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <Image
                src={profile?.profile_photo || "/avatar.png"}
                alt={profile?.full_name_en || "Teacher profile photo"}
                width={88}
                height={88}
                unoptimized
                className="h-[88px] w-[88px] rounded-lg border border-slate-200 object-cover dark:border-slate-700"
              />
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold text-slate-950 dark:text-white">{displayName}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{designation}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <ProfileFact icon={Mail} label="Email" value={profile?.email || session?.user?.email || "-"} />
              <ProfileFact icon={Phone} label="Phone" value={profile?.contact_number || "-"} />
              <ProfileFact icon={IdCard} label="Employee ID" value={profile?.employee_id || "-"} />
              <ProfileFact icon={CalendarDays} label="Joined" value={formatDate(profile?.joining_date)} />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">Official Details</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <InfoRow label="Subject" value={profile?.subject || "-"} />
              <InfoRow label="Employment" value={profile?.employment_type || "-"} />
              <InfoRow label="Blood Group" value={profile?.blood_group || "-"} />
              <InfoRow label="Nationality" value={profile?.nationality || "-"} />
            </dl>
          </section>
        </aside>

        <ProfileEditForm profile={profile} sessionEmail={session?.user?.email} />
      </div>
    </section>
  )
}

function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
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
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
          : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
      }`}
    >
      {message}
    </div>
  )
}

function ProfileFact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <Icon className="size-4 text-slate-500 dark:text-slate-400" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate font-medium text-slate-950 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-950 dark:text-white">{value}</dd>
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return "-"
  const [year, month, day] = value.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}
