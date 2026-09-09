"use client"

import { useState } from "react"
import { BadgeCheck, CheckCircle, Mail, MessageSquareText, Phone, Send, ShieldHalf, UserRound, AlertCircle } from "lucide-react"
import { submitContactForm } from "./actions"

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const resetForm = () => {
    setSubmitted(false)
    setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await submitContactForm(form)

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.message)
      }
    } catch {
      const errorMessage = "Failed to submit form. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.03),0_20px_40px_-12px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50/30 px-6 py-12 text-center">
          <CheckCircle className="mb-4 h-12 w-12 text-emerald-600" />
          <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            We&apos;ll review your message and respond within 24 hours.
          </p>
          <button
            onClick={resetForm}
            className="mt-6 rounded-lg border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50/50"
          >
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.03),0_20px_40px_-12px_rgba(15,23,42,0.05)]">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-emerald-700 ring-1 ring-emerald-100/80">
            <BadgeCheck className="h-3.5 w-3.5" />
            Quick Response
          </div>
          <h2 className="mt-3.5 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">Send Us a Message</h2>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-slate-600">
            Fill in the form below with as much detail as you can. Our team typically replies within one business day.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/80 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <UserRound className="h-4 w-4" />
              </span>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+880 1XXX-XXXXXX"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Subject <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <MessageSquareText className="h-4 w-4" />
              </span>
              <input
                id="subject"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us what you need help with, and include any useful details."
            className={`${inputClass} min-h-[140px] resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          <span>{loading ? "Sending..." : "Send Message"}</span>
        </button>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldHalf className="h-3.5 w-3.5 text-emerald-600/80" />
          <span>Your messages are secure and handled with care.</span>
        </p>
      </form>
    </div>
  )
}
