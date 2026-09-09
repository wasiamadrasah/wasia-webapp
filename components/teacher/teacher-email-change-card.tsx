"use client"

import { useState, useTransition } from "react"
import { Loader2, Mail, RefreshCw, ShieldCheck } from "lucide-react"
import { toast } from "@/components/ui/sonner"

import {
  requestTeacherEmailChangeOTP,
  verifyTeacherEmailChangeOTP,
} from "@/app/teacher/actions"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

type TeacherEmailChangeCardProps = {
  currentEmail: string
}

export function TeacherEmailChangeCard({ currentEmail }: TeacherEmailChangeCardProps) {
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpStep, setOtpStep] = useState(false)
  const [isPending, startTransition] = useTransition()

  const requestOTP = () => {
    startTransition(async () => {
      const result = await requestTeacherEmailChangeOTP(newEmail, currentPassword)

      if (result.success) {
        setOtpStep(true)
        setOtpCode("")
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  const verifyOTP = () => {
    startTransition(async () => {
      const result = await verifyTeacherEmailChangeOTP(otpCode)

      if (result.success) {
        toast.success(result.message)
        setOtpStep(false)
        setNewEmail("")
        setCurrentPassword("")
        setOtpCode("")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          <Mail className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Change Email</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">A verification code is required before email changes.</p>
        </div>
      </div>

      {!otpStep ? (
        <form
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            requestOTP()
          }}
        >
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            New Email Address
            <input
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              placeholder="new-email@school.com"
              className={inputClass}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Confirm your password"
              className={inputClass}
              required
            />
          </label>
          <button type="submit" disabled={isPending} className={buttonClass}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            Send Verification Code
          </button>
        </form>
      ) : (
        <form
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            verifyOTP()
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="teacher-email-otp" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Verification Code
              </label>
              <button
                type="button"
                disabled={isPending}
                onClick={requestOTP}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 disabled:opacity-60 dark:text-slate-300 dark:hover:text-white"
              >
                <RefreshCw className="size-3.5" />
                Resend
              </button>
            </div>
            <div className="mt-3 flex justify-center">
              <InputOTP
                id="teacher-email-otp"
                maxLength={6}
                value={otpCode}
                onChange={(value) => setOtpCode(value.replace(/\D/g, "").slice(0, 6))}
                required
              >
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-11 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:text-base *:data-[slot=input-otp-slot]:font-semibold">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-1" />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-11 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:text-base *:data-[slot=input-otp-slot]:font-semibold">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Code sent to {newEmail}. It expires in 15 minutes.
            </p>
          </div>
          <button type="submit" disabled={isPending || otpCode.length !== 6} className={buttonClass}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            Verify and Update Email
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setOtpStep(false)
              setOtpCode("")
            }}
            className="h-10 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Change Email Address
          </button>
        </form>
      )}
    </section>
  )
}

const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-slate-800"

const buttonClass =
  "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
