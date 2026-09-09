"use client"

import { useState } from "react"
import {
  GraduationCap,
  Search,
  FileText,
  AlertCircle,
  Printer,
  Download,
} from "lucide-react"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { PublicHero } from "@/components/layout/public-hero"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type SubjectResult = {
  subject_code: string
  subject_name: string
  grade: string
}

type StudentResult = {
  student_id: string
  year: string
  examination: string
  class: string
  section: string
  group: string
  registration_no?: string | null
  student_name: string
  father_name: string
  mother_name: string
  board: string
  session: string
  exam_type: string
  gender: string
  result: string
  date_of_birth: string
  subjects: SubjectResult[]
}

const sampleResults: StudentResult[] = [
  {
    student_id: "20241001",
    year: "2024",
    examination: "দাখিল",
    class: "১০ম",
    section: "ক",
    group: "বিজ্ঞান",
    registration_no: "1914208832",
    student_name: "মুহাম্মদ তানভীরুল ইসলাম",
    father_name: "মুহাম্মদ নজরুল ইসলাম",
    mother_name: "ফাতেমা বেগম",
    board: "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড",
    session: "2023-24",
    exam_type: "নিয়মিত",
    gender: "ছাত্র",
    result: "GPA 5.00 (A+)",
    date_of_birth: "12-05-2008",
    subjects: [
      { subject_code: "101", subject_name: "কুরআন মাজীদ ও তাজভীদ", grade: "A+" },
      { subject_code: "102", subject_name: "হাদিস শরিফ ও ফিকহ", grade: "A+" },
      { subject_code: "103", subject_name: "আরবি ১ম পত্র", grade: "A+" },
      { subject_code: "104", subject_name: "আরবি ২য় পত্র ও কাওয়াইদ", grade: "A+" },
      { subject_code: "105", subject_name: "বাংলা ১ম ও ২য় পত্র", grade: "A+" },
      { subject_code: "107", subject_name: "ইংরেজি ১ম ও ২য় পত্র", grade: "A+" },
      { subject_code: "109", subject_name: "সাধারণ গণিত", grade: "A+" },
      { subject_code: "136", subject_name: "পদার্থবিজ্ঞান", grade: "A+" },
      { subject_code: "137", subject_name: "রসায়ন", grade: "A+" },
      { subject_code: "154", subject_name: "তথ্য ও যোগাযোগ প্রযুক্তি", grade: "A+" },
    ],
  },
  {
    student_id: "20241002",
    year: "2024",
    examination: "বার্ষিক",
    class: "৯ম",
    section: "ক",
    group: "সাধারণ",
    registration_no: "1814102945",
    student_name: "মুহাম্মদ সাদিকুল ইসলাম",
    father_name: "মাওলানা মুহাম্মদ জালাল উদ্দীন",
    mother_name: "মোসাম্মৎ রুবী আক্তার",
    board: "মাদ্রাসা অভ্যন্তরীণ মূল্যায়ন",
    session: "2024",
    exam_type: "নিয়মিত",
    gender: "ছাত্র",
    result: "GPA 4.88 (A)",
    date_of_birth: "17-04-2009",
    subjects: [
      { subject_code: "101", subject_name: "কুরআন মাজীদ ও তাজভীদ", grade: "A+" },
      { subject_code: "102", subject_name: "হাদিস শরিফ", grade: "A+" },
      { subject_code: "103", subject_name: "আরবি ১ম পত্র", grade: "A+" },
      { subject_code: "104", subject_name: "আরবি ২য় পত্র", grade: "A" },
      { subject_code: "105", subject_name: "আকাইদ ও ফিকহ", grade: "A+" },
      { subject_code: "106", subject_name: "বাংলা", grade: "A+" },
      { subject_code: "107", subject_name: "ইংরেজি", grade: "A" },
      { subject_code: "109", subject_name: "সাধারণ গণিত", grade: "A+" },
    ],
  },
]

export default function ResultPage() {
  const [year, setYear] = useState("")
  const [examination, setExamination] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [section, setSection] = useState("")
  const [group, setGroup] = useState("")
  const [studentId, setStudentId] = useState("")
  const [searched, setSearched] = useState(false)
  const [result, setResult] = useState<StudentResult | null>(null)

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const query = studentId.trim()

    const found = sampleResults.find((student) => {
      const matchQuery = !query || student.student_id === query || student.student_id.includes(query)
      const matchYear = !year || student.year === year
      const matchExam = !examination || student.examination.includes(examination)
      const matchClass = !studentClass || student.class.includes(studentClass)
      const matchSection = !section || student.section.includes(section)
      const matchGroup = !group || student.group.includes(group)

      return matchQuery && matchYear && matchExam && matchClass && matchSection && matchGroup
    })

    setResult(found || null)
    setSearched(true)
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8F5]">
      {/* Public Hero adhering to Madrasah Design System */}
      <PublicHero
        title="একাডেমিক পরীক্ষার ফলাফল"
        subtitle="মাদ্রাসার অভ্যন্তরীণ ও বোর্ড পরীক্ষার ফলাফল অনুসন্ধান ও বিবরণী।"
        badgeText="ফলাফল পোর্টাল"
        badgeIcon={GraduationCap}
        breadcrumbCurrent="ফলাফল"
        breadcrumbParent={{ label: "হোম", href: "/" }}
      />

      {/* Main Search & Results Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Search Card */}
          <div className="overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-sm">
            {/* Card Header */}
            <div className="bg-[#075E54] px-6 py-4.5 sm:px-8 sm:py-5">
              <h2 className="flex items-center gap-2.5 font-heading text-lg sm:text-xl font-bold text-white">
                <FileText className="h-5 w-5 text-white/90" />
                <span>ফলাফল অনুসন্ধান</span>
              </h2>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSearch} className="p-6 sm:p-8">
              <div className="grid gap-5 md:grid-cols-3">
                
                {/* Year */}
                <div className="space-y-1.5">
                  <label className="block text-[15px] font-semibold text-[#17211E]">
                    শিক্ষাবর্ষ
                  </label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="h-[44px] w-full rounded-lg border border-[#E2E7E4] bg-white px-3.5 text-[15px] text-[#17211E] transition-all duration-200 hover:!border-[#075E54] hover:!ring-1 hover:!ring-[#075E54] focus:!border-[#075E54] focus:!ring-1 focus:!ring-[#075E54] focus-visible:!border-[#075E54] focus-visible:!ring-1 focus-visible:!ring-[#075E54] [&:not(:disabled)]:hover:!border-[#075E54] [&:not(:disabled)]:hover:!ring-1 [&:not(:disabled)]:hover:!ring-[#075E54] [&:not(:disabled)]:focus-visible:!border-[#075E54] [&:not(:disabled)]:focus-visible:!ring-1 [&:not(:disabled)]:focus-visible:!ring-[#075E54] shadow-none">
                      <SelectValue placeholder="শিক্ষাবর্ষ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">২০২৫</SelectItem>
                      <SelectItem value="2024">২০২৪</SelectItem>
                      <SelectItem value="2023">২০২৩</SelectItem>
                      <SelectItem value="2022">২০২২</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Examination */}
                <div className="space-y-1.5">
                  <label className="block text-[15px] font-semibold text-[#17211E]">
                    পরীক্ষার নাম
                  </label>
                  <Select value={examination} onValueChange={setExamination}>
                    <SelectTrigger className="h-[44px] w-full rounded-lg border border-[#E2E7E4] bg-white px-3.5 text-[15px] text-[#17211E] transition-all duration-200 hover:!border-[#075E54] hover:!ring-1 hover:!ring-[#075E54] focus:!border-[#075E54] focus:!ring-1 focus:!ring-[#075E54] focus-visible:!border-[#075E54] focus-visible:!ring-1 focus-visible:!ring-[#075E54] [&:not(:disabled)]:hover:!border-[#075E54] [&:not(:disabled)]:hover:!ring-1 [&:not(:disabled)]:hover:!ring-[#075E54] [&:not(:disabled)]:focus-visible:!border-[#075E54] [&:not(:disabled)]:focus-visible:!ring-1 [&:not(:disabled)]:focus-visible:!ring-[#075E54] shadow-none">
                      <SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="দাখিল">দাখিল পরীক্ষা</SelectItem>
                      <SelectItem value="আলিম">আলিম পরীক্ষা</SelectItem>
                      <SelectItem value="বার্ষিক">বার্ষিক পরীক্ষা</SelectItem>
                      <SelectItem value="অর্ধ-বার্ষিক">অর্ধ-বার্ষিক পরীক্ষা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Class */}
                <div className="space-y-1.5">
                  <label className="block text-[15px] font-semibold text-[#17211E]">
                    শ্রেণি / জামাত
                  </label>
                  <Select value={studentClass} onValueChange={setStudentClass}>
                    <SelectTrigger className="h-[44px] w-full rounded-lg border border-[#E2E7E4] bg-white px-3.5 text-[15px] text-[#17211E] transition-all duration-200 hover:!border-[#075E54] hover:!ring-1 hover:!ring-[#075E54] focus:!border-[#075E54] focus:!ring-1 focus:!ring-[#075E54] focus-visible:!border-[#075E54] focus-visible:!ring-1 focus-visible:!ring-[#075E54] [&:not(:disabled)]:hover:!border-[#075E54] [&:not(:disabled)]:hover:!ring-1 [&:not(:disabled)]:hover:!ring-[#075E54] [&:not(:disabled)]:focus-visible:!border-[#075E54] [&:not(:disabled)]:focus-visible:!ring-1 [&:not(:disabled)]:focus-visible:!ring-[#075E54] shadow-none">
                      <SelectValue placeholder="শ্রেণি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="১০ম">১০ম শ্রেণি (দাখিল)</SelectItem>
                      <SelectItem value="৯ম">৯ম শ্রেণি</SelectItem>
                      <SelectItem value="৮ম">৮ম শ্রেণি</SelectItem>
                      <SelectItem value="৭ম">৭ম শ্রেণি</SelectItem>
                      <SelectItem value="৬ষ্ঠ">৬ষ্ঠ শ্রেণি</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Section */}
                <div className="space-y-1.5">
                  <label className="block text-[15px] font-semibold text-[#17211E]">
                    শাখা
                  </label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger className="h-[44px] w-full rounded-lg border border-[#E2E7E4] bg-white px-3.5 text-[15px] text-[#17211E] transition-all duration-200 hover:!border-[#075E54] hover:!ring-1 hover:!ring-[#075E54] focus:!border-[#075E54] focus:!ring-1 focus:!ring-[#075E54] focus-visible:!border-[#075E54] focus-visible:!ring-1 focus-visible:!ring-[#075E54] [&:not(:disabled)]:hover:!border-[#075E54] [&:not(:disabled)]:hover:!ring-1 [&:not(:disabled)]:hover:!ring-[#075E54] [&:not(:disabled)]:focus-visible:!border-[#075E54] [&:not(:disabled)]:focus-visible:!ring-1 [&:not(:disabled)]:focus-visible:!ring-[#075E54] shadow-none">
                      <SelectValue placeholder="শাখা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ক">শাখা ক</SelectItem>
                      <SelectItem value="খ">শাখা খ</SelectItem>
                      <SelectItem value="গ">শাখা গ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Group */}
                <div className="space-y-1.5">
                  <label className="block text-[15px] font-semibold text-[#17211E]">
                    বিভাগ
                  </label>
                  <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger className="h-[44px] w-full rounded-lg border border-[#E2E7E4] bg-white px-3.5 text-[15px] text-[#17211E] transition-all duration-200 hover:!border-[#075E54] hover:!ring-1 hover:!ring-[#075E54] focus:!border-[#075E54] focus:!ring-1 focus:!ring-[#075E54] focus-visible:!border-[#075E54] focus-visible:!ring-1 focus-visible:!ring-[#075E54] [&:not(:disabled)]:hover:!border-[#075E54] [&:not(:disabled)]:hover:!ring-1 [&:not(:disabled)]:hover:!ring-[#075E54] [&:not(:disabled)]:focus-visible:!border-[#075E54] [&:not(:disabled)]:focus-visible:!ring-1 [&:not(:disabled)]:focus-visible:!ring-[#075E54] shadow-none">
                      <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="সাধারণ">সাধারণ</SelectItem>
                      <SelectItem value="বিজ্ঞান">বিজ্ঞান</SelectItem>
                      <SelectItem value="মুজাব্বিদ">মুজাব্বিদ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Student ID */}
                <div className="space-y-1.5">
                  <label className="block text-[15px] font-semibold text-[#17211E]">
                    স্টুডেন্ট আইডি
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="যেমন: 20241001"
                    value={studentId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 8)
                      setStudentId(val)
                    }}
                    className="h-[44px] w-full rounded-lg border border-[#E2E7E4] bg-white px-3.5 text-[15px] text-[#17211E] placeholder:text-[#5F6B67] transition-all duration-200 hover:!border-[#075E54] hover:!ring-1 hover:!ring-[#075E54] focus:!border-[#075E54] focus:!ring-1 focus:!ring-[#075E54] focus-visible:!border-[#075E54] focus-visible:!ring-1 focus-visible:!ring-[#075E54] [&:not(:disabled)]:hover:!border-[#075E54] [&:not(:disabled)]:hover:!ring-1 [&:not(:disabled)]:hover:!ring-[#075E54] [&:not(:disabled)]:focus-visible:!border-[#075E54] [&:not(:disabled)]:focus-visible:!ring-1 [&:not(:disabled)]:focus-visible:!ring-[#075E54] shadow-none"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="mt-7 flex h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#075E54] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#064A42] active:scale-[0.99]"
              >
                <Search className="h-4.5 w-4.5" />
                <span>ফলাফল অনুসন্ধান করুন</span>
              </button>
            </form>
          </div>

          {/* Result Output */}
          {searched && result && (
            <div className="space-y-8">
              {/* Student Summary Card */}
              <div className="rounded-2xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 border-b border-[#E2E7E4] pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#17211E]">
                      শিক্ষার্থীর তথ্য বিবরণী
                    </h3>
                    <p className="mt-1 text-[15px] text-[#5F6B67]">
                      অফিসিয়াল একাডেমিক ফলাফল সংক্রান্ত তথ্য
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex h-[40px] items-center gap-2 rounded-lg border border-[#075E54] bg-white px-4 text-[14px] font-semibold text-[#075E54] transition-colors duration-200 hover:bg-[#F0F7F5]"
                    >
                      <Printer className="h-4 w-4" />
                      <span>প্রিন্ট করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex h-[40px] items-center gap-2 rounded-lg bg-[#075E54] px-4 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#064A42]"
                    >
                      <Download className="h-4 w-4" />
                      <span>ডাউনলোড</span>
                    </button>
                  </div>
                </div>

                <div className="grid gap-y-3.5 text-[15px] sm:grid-cols-2 lg:grid-cols-4 text-[#17211E]">
                  <div><span className="font-semibold text-[#5F6B67]">স্টুডেন্ট আইডি:</span> <span className="font-bold text-[#075E54]">{result.student_id}</span></div>
                  <div><span className="font-semibold text-[#5F6B67]">রেজিস্ট্রেশন নম্বর:</span> {result.registration_no || "প্রযোজ্য নয়"}</div>
                  <div className="sm:col-span-2"><span className="font-semibold text-[#5F6B67]">শিক্ষার্থীর নাম:</span> <span className="font-bold text-[#17211E]">{result.student_name}</span></div>

                  <div className="sm:col-span-2"><span className="font-semibold text-[#5F6B67]">পিতার নাম:</span> {result.father_name}</div>
                  <div className="sm:col-span-2"><span className="font-semibold text-[#5F6B67]">মাতার নাম:</span> {result.mother_name}</div>

                  <div><span className="font-semibold text-[#5F6B67]">বোর্ড / মূল্যায়ন:</span> {result.board}</div>
                  <div><span className="font-semibold text-[#5F6B67]">সেশন:</span> {result.session}</div>
                  <div><span className="font-semibold text-[#5F6B67]">বিভাগ:</span> {result.group}</div>
                  <div><span className="font-semibold text-[#5F6B67]">পরীক্ষার ধরন:</span> {result.exam_type}</div>

                  <div><span className="font-semibold text-[#5F6B67]">লিঙ্গ:</span> {result.gender}</div>
                  <div><span className="font-semibold text-[#5F6B67]">ফলাফল:</span> <span className="font-bold text-[#075E54]">{result.result}</span></div>
                  <div><span className="font-semibold text-[#5F6B67]">জন্ম তারিখ:</span> {result.date_of_birth}</div>
                </div>
              </div>

              {/* Subject Table Card */}
              <div className="overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-sm">
                <div className="border-b border-[#E2E7E4] bg-[#F7F8F5] px-6 py-4 sm:px-8">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#17211E]">
                    বিষয়ভিত্তিক গ্রেড ও ফলাফল
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#E2E7E4] text-[15px]">
                    <thead className="bg-[#075E54] text-white">
                      <tr>
                        <th className="px-6 py-3.5 text-left text-[14px] font-semibold">
                          বিষয় কোড
                        </th>
                        <th className="px-6 py-3.5 text-left text-[14px] font-semibold">
                          বিষয়ের নাম
                        </th>
                        <th className="px-6 py-3.5 text-center text-[14px] font-semibold">
                          প্রাপ্ত গ্রেড
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#E2E7E4] bg-white">
                      {result.subjects.map((subject) => (
                        <tr key={subject.subject_code} className="hover:bg-[#F7F8F5] transition-colors duration-150">
                          <td className="px-6 py-3.5 text-[#5F6B67] font-medium">{subject.subject_code}</td>
                          <td className="px-6 py-3.5 font-medium text-[#17211E]">
                            {subject.subject_name}
                          </td>
                          <td className="px-6 py-3.5 text-center">
                            <span className="inline-block rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-0.5 text-[13px] font-bold text-[#075E54]">
                              {subject.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Not Found Output */}
          {searched && !result && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-8 sm:p-10 text-center">
              <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-rose-200 text-rose-500 shadow-xs">
                <AlertCircle className="h-6 w-6" />
              </div>

              <h3 className="font-heading text-xl font-bold text-[#17211E]">
                ফলাফল পাওয়া যায়নি
              </h3>

              <p className="mt-2 text-[15px] text-[#5F6B67]">
                অনুগ্রহ করে সকল ফিল্ড ও স্টুডেন্ট আইডি সঠিকভাবে প্রদান করে পুনরায় অনুসন্ধান করুন।
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
