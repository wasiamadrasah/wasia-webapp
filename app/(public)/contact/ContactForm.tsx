"use client"

import { useState } from "react"
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  Tag,
  UserRound,
} from "lucide-react"
import { submitContactForm } from "./actions"

const inputClass =
  "w-full rounded-lg border border-[#E2E7E4] bg-[#F7F8F5] px-4 py-3 text-[15px] text-[#17211E] outline-none transition placeholder:text-[#5F6B67]/60 focus:border-[#075E54] focus:bg-white focus:ring-2 focus:ring-[#075E54]/15"

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const resetForm = () => {
    setSubmitted(false)
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      category: "general",
    })
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
        setError(result.message || "বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।")
      }
    } catch {
      setError("সার্ভারে ত্রুটি হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-[#E2E7E4] bg-white p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#075E54]/20 bg-[#F0F7F5] px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#075E54] text-white shadow-sm mb-4">
            <CheckCircle className="h-9 w-9 text-white" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-[#17211E]">
            আপনার বার্তা সফলভাবে গৃহীত হয়েছে!
          </h3>
          <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-[#5F6B67]">
            ওয়াসিয়া কামিল মাদ্রাসার সাথে যোগাযোগের জন্য ধন্যবাদ। আমাদের সংশ্লিষ্ট কর্মকর্তা দ্রুত আপনার সাথে যোগাযোগ করবেন।
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#075E54] px-6 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#064A42]"
          >
            আরেকটি বার্তা পাঠান
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3 py-1 text-[13px] font-semibold text-[#075E54]">
          <BadgeCheck className="h-3.5 w-3.5" />
          <span>অনলাইন যোগাযোগ ফরম</span>
        </div>
        <h2 className="font-heading font-bold mt-1 text-2xl sm:text-3xl text-[#17211E]">
          আমাদের বার্তা পাঠান
        </h2>
        <p className="text-[15px] leading-relaxed text-[#5F6B67]">
          নিচের তথ্যগুলো পূরণ করে আপনার জিজ্ঞাসা বা মতামত পাঠান। আমরা দ্রুততম সময়ে উত্তর দেব ইনশাআল্লাহ।
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <p className="text-[15px] text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[15px] font-semibold text-[#17211E]"
            >
              আপনার পূর্ণ নাম <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5F6B67]">
                <UserRound className="h-4 w-4" />
              </span>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[15px] font-semibold text-[#17211E]"
            >
              ইমেইল ঠিকানা <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5F6B67]">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-[15px] font-semibold text-[#17211E]"
            >
              মোবাইল নম্বর
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5F6B67]">
                <Phone className="h-4 w-4" />
              </span>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="০১৭xxxxxxxx"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-[15px] font-semibold text-[#17211E]"
            >
              অনুসন্ধানের ধরন
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5F6B67]">
                <Tag className="h-4 w-4" />
              </span>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`${inputClass} pl-10 bg-white`}
              >
                <option value="general">সাধারণ অনুসন্ধান</option>
                <option value="admission">ভর্তি সংক্রান্ত তথ্য</option>
                <option value="feedback">পরামর্শ ও মতামত</option>
                <option value="complaint">অভিযোগ / আপত্তি</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-[15px] font-semibold text-[#17211E]"
          >
            বিষয় <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5F6B67]">
              <MessageSquareText className="h-4 w-4" />
            </span>
            <input
              id="subject"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              placeholder="বার্তার মূল বিষয় লিখুন"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-[15px] font-semibold text-[#17211E]"
          >
            আপনার বার্তা / বিস্তারিত <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            placeholder="আপনার প্রশ্ন বা বার্তা বিস্তারিত লিখুন..."
            className={`${inputClass} min-h-[140px] resize-none`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#075E54] px-6 py-3.5 text-[16px] font-bold text-white transition-colors duration-200 hover:bg-[#064A42] shadow-xs disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          <span>{loading ? "বার্তা পাঠানো হচ্ছে..." : "বার্তা পাঠান"}</span>
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-[14px] text-[#5F6B67]">
          <ShieldCheck className="h-4 w-4 text-[#075E54]" />
          <span>আপনার তথ্যের গোপনীয়তা সম্পূর্ণ সুরক্ষিত থাকবে।</span>
        </p>
      </form>
    </div>
  )
}
