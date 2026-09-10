"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  ChevronDown,
  HelpCircle,
  GraduationCap,
  School,
  BookOpen,
  Sparkles,
  Phone,
  ArrowRight,
  Search,
  Building2,
  Moon,
  HeartHandshake,
  Laptop,
  X,
  MapPin,
} from "lucide-react"
import { PublicHero } from "@/components/layout/public-hero"

type FAQ = {
  category: string
  q: string
  a: string
}

const faqs: FAQ[] = [
  // ভর্তি ও সেশন
  {
    category: "ভর্তি ও সেশন",
    q: "আলিম ১ম বর্ষে ভর্তি প্রক্রিয়া কীভাবে সম্পন্ন করতে হয়?",
    a: "বাংলাদেশ সরকারের শিক্ষা মন্ত্রণালয়ের নির্দেশনা অনুযায়ী আলিম ১ম বর্ষে কেন্দ্রীয় ভর্তি ওয়েবসাইট xiclassadmission.gov.bd এর মাধ্যমে আবেদন করতে হয়। আমাদের মাদ্রাসার EIIN নম্বর: ১০৪২৩৩ এবং মাদ্রাসা কোড: ২০১৮৮ নির্বাচন করে সহজে আবেদন সম্পন্ন করা যায়। বিস্তারিত তথ্যের জন্য আমাদের ভর্তি হেল্পলাইনে যোগাযোগ করতে পারেন।",
  },
  {
    category: "ভর্তি ও সেশন",
    q: "ইবতেদায়ী, দাখিল ও হিফজ শাখায় ভর্তির নিয়ম কী?",
    a: "ইবতেদায়ী, দাখিল ও হিফজুল কুরআন শাখায় ভর্তির জন্য মাদ্রাসা কার্যালয় থেকে সরাসরি ভর্তি ফরম সংগ্রহ করে প্রয়োজনীয় কাগজপত্র (জন্মনিবন্ধন, পূর্ববর্তী ক্লাসের প্রত্যয়নপত্র ও ছবি) জমা দিতে হয়।",
  },

  // একাডেমিক ও বিভাগ
  {
    category: "একাডেমিক ও বিভাগ",
    q: "মাদ্রাসায় কোন কোন বিভাগ বা শাখা চালু রয়েছে?",
    a: "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসায় দাখিল ও আলিম স্তরে বিজ্ঞান (Science), মানবিক (Humanities) এবং ব্যবসায় শিক্ষা (Business Studies) তিনটি প্রধান শাখায় মানসম্মত শিক্ষাদান করা হয়। এছাড়াও আন্তর্জাতিক মানসম্পন্ন হিফজুল কুরআন বিভাগ পরিচালিত হচ্ছে।",
  },
  {
    category: "একাডেমিক ও বিভাগ",
    q: "আধুনিক কম্পিউটার ও তথ্যপ্রযুক্তি প্রশিক্ষণের সুযোগ আছে কি?",
    a: "হ্যাঁ। মাদ্রাসায় সুসজ্জিত ডিজিটাল কম্পিউটার ল্যাব ও প্রজেক্টর সমৃদ্ধ আধুনিক মাল্টিমিডিয়া ক্লাসরুম রয়েছে। এখানে শিক্ষার্থীদের নিয়মিত তথ্যপ্রযুক্তি ও ব্যবহারিক কম্পিউটার প্রশিক্ষণ প্রদান করা হয়।",
  },
  {
    category: "একাডেমিক ও বিভাগ",
    q: "আরবি ব্যাকরণ ও ভাষা শিক্ষার বিশেষ কোর্সের সুবিধা আছে কি?",
    a: "হ্যাঁ। কুরআন ও হাদিসের বিশুদ্ধ মর্মার্থ অনুধাবন এবং প্রাতিষ্ঠানিক দক্ষতা বৃদ্ধির লক্ষ্যে অভিজ্ঞ ওলামায়ে কেরামের তত্ত্বাবধানে নিয়মিত বিশেষ আরবি গ্রামার ও স্পোকেন অ্যারাবিক কোর্স পরিচালনা করা হয়।",
  },

  // হিফজ ও আবাসিক
  {
    category: "হিফজ ও আবাসিক",
    q: "আবাসিক হোষ্টেল ও থাকা-খাওয়ার পরিবেশ কেমন?",
    a: "দূর-দূরান্তের শিক্ষার্থীদের জন্য নিরিবিলি, পরিচ্ছন্ন ও অত্যন্ত সুশৃঙ্খল আবাসিক ব্যবস্থা রয়েছে। আবাসিক ছাত্রদের জন্য পুষ্টিকর ও স্বাস্থ্যসম্মত খাবার এবং সার্বক্ষণিক অভিজ্ঞ শিক্ষকের নিবিড় তত্ত্বাবধান নিশ্চিত করা হয়।",
  },
  {
    category: "হিফজ ও আবাসিক",
    q: "সান্ধ্যকালীন বিশেষ ক্লাস কীভাবে পরিচালিত হয়?",
    a: "উপযুক্ত আলেমেদ্বীন ও দক্ষ শিক্ষার্থী তৈরির লক্ষ্যে প্রতিদিন মাগরিবের পর থেকে অভিজ্ঞ শিক্ষকদের উপস্থিতিতে নিয়মিত সান্ধ্যকালীন বিশেষ পাঠদান ও পড়া তদারকি করা হয়।",
  },

  // বেতন ও বৃত্তি
  {
    category: "বেতন ও বৃত্তি",
    q: "অসচ্ছল ও মেধাবী শিক্ষার্থীদের জন্য কি বৃত্তির ব্যবস্থা আছে?",
    a: "হ্যাঁ। এতিম, গরীব ও আর্থিক দিক থেকে অসচ্ছল পরিবারের মেধাবী শিক্ষার্থীদের জন্য মাদ্রাসার নিজস্ব ফান্ড থেকে বিশেষ শিক্ষাবৃত্তি, মাসিক ফি মওকুফ ও থাকা-খাওয়ার ক্ষেত্রে বিশেষ ছাড় প্রদান করা হয়।",
  },

  // সাধারণ ও পরিচয়
  {
    category: "সাধারণ ও পরিচয়",
    q: "মাদ্রাসার EIIN নম্বর ও বোর্ড কোড কত?",
    a: "মাদ্রাসার EIIN নম্বর হলো ১০৪২৩৩ এবং বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের কোড হলো ২০১৮৮। এটি চট্টগ্রাম মহানগরীর চান্দগাঁও থানার অন্তর্গত একটি ঐতিহ্যবাহী আলিম মাদ্রাসা।",
  },
  {
    category: "সাধারণ ও পরিচয়",
    q: "মাদ্রাসার সঠিক অবস্থান ও যোগাযোগের ঠিকানা কী?",
    a: "আমাদের ক্যাম্পাস চট্টগ্রামের চান্দগাঁও থানাধীন পূর্ব ষোলশহরের খাজা রোড (বাদামতল) এলাকায় অবস্থিত। যেকোনো তথ্য ও পরামর্শের জন্য হেল্পলাইন নম্বর: ০১৮৭৮-৯২৫৩২৫, ০১৮১২-৪৭১০৪০ অথবা ০১৭০১-০১৮৭২৬-এ যোগাযোগ করতে পারেন।",
  },
]

const categories = [
  "সকল প্রশ্ন",
  "ভর্তি ও সেশন",
  "একাডেমিক ও বিভাগ",
  "হিফজ ও আবাসিক",
  "বেতন ও বৃত্তি",
  "সাধারণ ও পরিচয়",
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState("সকল প্রশ্ন")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return faqs.filter((faq) => {
      const matchCategory =
        activeCategory === "সকল প্রশ্ন" ? true : faq.category === activeCategory

      const matchQuery = query
        ? faq.q.toLowerCase().includes(query) ||
          faq.a.toLowerCase().includes(query) ||
          faq.category.toLowerCase().includes(query)
        : true

      return matchCategory && matchQuery
    })
  }, [activeCategory, searchQuery])

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="সাধারণ জিজ্ঞাসা ও উত্তর"
        subtitle="ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার ভর্তি, বিভাগসমূহ, হিফজ শাখা, আবাসিক সুবিধা ও সার্বিক তথ্য সম্পর্কিত সচরাচর জিজ্ঞাসিত প্রশ্নাবলি।"
        badgeText="সহায়তা ও প্রশ্নোত্তর"
        badgeIcon={HelpCircle}
        breadcrumbCurrent="সাধারণ জিজ্ঞাসা"
      />

      {/* 2. Main Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="faq-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#faq-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Quick Search & Category Bar */}
          <div className="rounded-3xl border border-[#E2E7E4] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F6B67]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="আপনার প্রশ্ন লিখে খুঁজুন (যেমন: ভর্তি, হিফজ, হোস্টেল)..."
                  className="w-full rounded-xl border border-[#E2E7E4] bg-[#F7F8F5] pl-10 pr-9 py-2.5 text-[14px] text-[#17211E] placeholder:text-[#5F6B67]/70 focus:border-[#075E54] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#075E54] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B67] hover:text-[#17211E]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="text-[13.5px] font-medium text-[#5F6B67]">
                মোট <strong className="text-[#075E54] font-bold">{filteredFaqs.length}</strong> টি প্রশ্নোত্তর রয়েছে
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E7E4]/70">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat)
                      setOpen(null)
                    }}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                      isSelected
                        ? "bg-[#075E54] text-white shadow-xs"
                        : "bg-[#F7F8F5] text-[#5F6B67] hover:bg-[#F0F7F5] hover:text-[#075E54] border border-[#E2E7E4]"
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-12 text-center space-y-3 shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                <HelpCircle className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#17211E]">
                কোনো প্রশ্নোত্তর পাওয়া যায়নি
              </h3>
              <p className="text-[14px] text-[#5F6B67] max-w-sm mx-auto">
                আপনার অনুসন্ধানের সাথে মিল রেখে কোনো প্রশ্ন পাওয়া যায়নি। সরাসরি তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>
              {(searchQuery || activeCategory !== "সকল প্রশ্ন") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("সকল প্রশ্ন")
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[#064A42] transition"
                >
                  <span>সকল প্রশ্ন দেখুন</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFaqs.map((faq, i) => {
                const isOpen = open === i

                return (
                  <div
                    key={`${faq.q}-${i}`}
                    className={`rounded-3xl border bg-white shadow-xs transition-all overflow-hidden ${
                      isOpen
                        ? "border-[#075E54]/50 shadow-md ring-1 ring-[#075E54]/20"
                        : "border-[#E2E7E4] hover:border-[#075E54]/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-2.5 py-0.5 text-[11.5px] font-bold text-[#075E54]">
                          {faq.category}
                        </span>
                        <h3 className="font-heading text-[16px] sm:text-[17.5px] font-bold text-[#17211E] leading-snug">
                          {faq.q}
                        </h3>
                      </div>

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                          isOpen
                            ? "rotate-180 bg-[#075E54] text-white"
                            : "bg-[#F7F8F5] text-[#5F6B67] border border-[#E2E7E4]"
                        }`}
                      >
                        <ChevronDown className="h-4.5 w-4.5" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#E2E7E4]/70 bg-[#F7F8F5]/60 px-5 sm:px-6 py-4.5">
                        <p className="text-[14.5px] leading-relaxed text-[#17211E]/90 whitespace-pre-wrap">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Section 4: Helplines & Contact Callout (Solid Evergreen) */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-8 sm:p-10 text-white shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B68A18]/40 bg-white/10 px-3.5 py-1 text-[12.5px] font-semibold text-[#B68A18]">
                  <Phone className="h-3.5 w-3.5" />
                  <span>সরাসরি সহায়তা</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-snug">
                  আরও কিছু জানতে চান?
                </h3>
                <p className="text-[14.5px] leading-relaxed text-[#DCEEE9]">
                  ভর্তি তথ্য, হিফজ বিভাগ বা অন্য যেকোনো বিষয়ে তথ্যের জন্য সরাসরি আমাদের হেল্পলাইন নম্বরে কল করতে পারেন অথবা মাদ্রাসা অফিসে উপস্থিত হতে পারেন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/admission"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-5 py-2.5 text-[14px] font-bold text-white border border-[#B68A18]/30 shadow-xs hover:bg-[#064A42] transition-colors"
                >
                  <span>ভর্তি তথ্য দেখুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  <span>যোগাযোগ পেইজ</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
              <a
                href="tel:01878925325"
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-center text-[13.5px] font-medium text-white hover:bg-white/10 transition"
              >
                <Phone className="h-4 w-4 text-[#B68A18]" />
                <span>০১৮৭৮-৯২৫৩২৫</span>
              </a>
              <a
                href="tel:01812471040"
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-center text-[13.5px] font-medium text-white hover:bg-white/10 transition"
              >
                <Phone className="h-4 w-4 text-[#B68A18]" />
                <span>০১৮১২-৪৭১০৪০</span>
              </a>
              <a
                href="tel:01701018726"
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-center text-[13.5px] font-medium text-white hover:bg-white/10 transition"
              >
                <Phone className="h-4 w-4 text-[#B68A18]" />
                <span>০১৭০১-০১৮৭২৬</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
