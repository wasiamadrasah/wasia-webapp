"use client"

import { useState } from "react"
import { Edit3, X } from "lucide-react"

import { updateTeacherProfileAction } from "@/app/teacher/actions"
import { SubmitButton } from "@/components/forms/submit-button"

type TeacherProfileFormRecord = {
  employee_id: string | null
  full_name_en: string | null
  full_name_bn: string | null
  gender: string | null
  date_of_birth: string | null
  marital_status: string | null
  religion: string | null
  nationality: string | null
  blood_group: string | null
  designation: string | null
  type: string | null
  subject: string | null
  employment_type: string | null
  joining_date: string | null
  email: string | null
  contact_number: string | null
  alt_contact_number: string | null
  emergency_contact: string | null
  nid_number: string | null
  birth_certificate: string | null
  passport_number: string | null
}

type ProfileEditFormProps = {
  profile: TeacherProfileFormRecord | null
  sessionEmail?: string | null
}

export function ProfileEditForm({ profile, sessionEmail }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Profile Information</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review your information. Click Edit to make changes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Edit3 className="size-4" />
            Edit
          </button>
        </header>

        <div className="space-y-6 p-5">
          <ReadOnlySection title="Identity">
            <InfoItem label="Employee ID" value={profile?.employee_id} />
            <InfoItem label="Full Name in English" value={profile?.full_name_en} />
            <InfoItem label="Full Name in Bangla" value={profile?.full_name_bn} />
            <InfoItem label="Gender" value={profile?.gender} />
            <InfoItem label="Date of Birth" value={formatDate(profile?.date_of_birth)} />
            <InfoItem label="Marital Status" value={profile?.marital_status} />
          </ReadOnlySection>

          <ReadOnlySection title="Professional">
            <InfoItem label="Designation" value={profile?.designation} />
            <InfoItem label="Staff Type" value={profile?.type} />
            <InfoItem label="Subject" value={profile?.subject} />
            <InfoItem label="Employment Type" value={profile?.employment_type} />
            <InfoItem label="Joining Date" value={formatDate(profile?.joining_date)} />
            <InfoItem label="Blood Group" value={profile?.blood_group} />
          </ReadOnlySection>

          <ReadOnlySection title="Contact">
            <InfoItem label="Email" value={profile?.email || sessionEmail} />
            <InfoItem label="Contact Number" value={profile?.contact_number} />
            <InfoItem label="Alternative Contact" value={profile?.alt_contact_number} />
            <InfoItem label="Emergency Contact" value={profile?.emergency_contact} />
          </ReadOnlySection>

          <ReadOnlySection title="Government and Personal">
            <InfoItem label="Religion" value={profile?.religion} />
            <InfoItem label="Nationality" value={profile?.nationality} />
            <InfoItem label="NID Number" value={profile?.nid_number} />
            <InfoItem label="Birth Certificate" value={profile?.birth_certificate} />
            <InfoItem label="Passport Number" value={profile?.passport_number} />
          </ReadOnlySection>
        </div>
      </section>
    )
  }

  return (
    <form
      action={updateTeacherProfileAction}
      className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Edit Profile Information</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            You can update every profile field except Employee ID, Staff Type, and Email.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <X className="size-4" />
          Cancel
        </button>
      </header>

      <div className="space-y-6 p-5">
        <FormSection title="Identity">
          <Field label="Employee ID">
            <input value={profile?.employee_id || ""} className={disabledInputClass} disabled readOnly />
          </Field>
          <Field label="Full Name in English">
            <input name="full_name_en" defaultValue={profile?.full_name_en || ""} className={inputClass} required />
          </Field>
          <Field label="Full Name in Bangla">
            <input name="full_name_bn" defaultValue={profile?.full_name_bn || ""} className={inputClass} />
          </Field>
          <Field label="Gender">
            <select name="gender" defaultValue={profile?.gender || ""} className={inputClass}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>
          <Field label="Date of Birth">
            <input name="date_of_birth" defaultValue={formatDate(profile?.date_of_birth)} placeholder="dd/mm/yyyy" className={inputClass} />
          </Field>
          <Field label="Marital Status">
            <select name="marital_status" defaultValue={profile?.marital_status || ""} className={inputClass}>
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </Field>
        </FormSection>

        <FormSection title="Professional">
          <Field label="Designation">
            <input name="designation" defaultValue={profile?.designation || ""} className={inputClass} />
          </Field>
          <Field label="Staff Type">
            <input value={profile?.type || ""} className={disabledInputClass} disabled readOnly />
          </Field>
          <Field label="Subject">
            <input name="subject" defaultValue={profile?.subject || ""} className={inputClass} />
          </Field>
          <Field label="Employment Type">
            <select name="employment_type" defaultValue={profile?.employment_type || ""} className={inputClass}>
              <option value="">Select employment type</option>
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
              <option value="Part-time">Part-time</option>
              <option value="Contractual">Contractual</option>
              <option value="Guest">Guest</option>
            </select>
          </Field>
          <Field label="Joining Date">
            <input name="joining_date" defaultValue={formatDate(profile?.joining_date)} placeholder="dd/mm/yyyy" className={inputClass} />
          </Field>
          <Field label="Blood Group">
            <select name="blood_group" defaultValue={profile?.blood_group || ""} className={inputClass}>
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </Field>
        </FormSection>

        <FormSection title="Contact">
          <Field label="Email">
            <input value={profile?.email || sessionEmail || ""} className={disabledInputClass} disabled readOnly />
          </Field>
          <Field label="Contact Number">
            <input name="contact_number" defaultValue={profile?.contact_number || ""} className={inputClass} />
          </Field>
          <Field label="Alternative Contact">
            <input name="alt_contact_number" defaultValue={profile?.alt_contact_number || ""} className={inputClass} />
          </Field>
          <Field label="Emergency Contact">
            <input name="emergency_contact" defaultValue={profile?.emergency_contact || ""} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection title="Government and Personal">
          <Field label="Religion">
            <input name="religion" defaultValue={profile?.religion || ""} className={inputClass} />
          </Field>
          <Field label="Nationality">
            <input name="nationality" defaultValue={profile?.nationality || ""} className={inputClass} />
          </Field>
          <Field label="NID Number">
            <input name="nid_number" defaultValue={profile?.nid_number || ""} className={inputClass} />
          </Field>
          <Field label="Birth Certificate">
            <input name="birth_certificate" defaultValue={profile?.birth_certificate || ""} className={inputClass} />
          </Field>
          <Field label="Passport Number">
            <input name="passport_number" defaultValue={profile?.passport_number || ""} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection title="Files">
          <Field label="Profile Photo">
            <input type="file" name="profile_photo" accept="image/png,image/jpeg,image/webp" className={fileClass} />
          </Field>
          <Field label="Signature Image">
            <input type="file" name="signature" accept="image/png,image/jpeg,image/webp" className={fileClass} />
          </Field>
        </FormSection>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Accepted image formats: JPG, PNG, WEBP. Max 2MB.</p>
        <SubmitButton
          idleLabel="Save Changes"
          pendingLabel="Saving..."
          className="h-10 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        />
      </footer>
    </form>
  )
}

const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-slate-800"

const disabledInputClass =
  "h-11 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500"

const fileClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      {children}
    </label>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  )
}

function ReadOnlySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  )
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-950 dark:text-white">{value || "-"}</p>
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return ""
  const [year, month, day] = value.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}
