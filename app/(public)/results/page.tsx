"use client"

import { Outfit } from "next/font/google"
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
  roll_no: string
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
    student_id: "STD-114131",
    year: "2014",
    examination: "SSC",
    class: "10",
    section: "A",
    group: "SCIENCE",
    roll_no: "114131",
    registration_no: null,
    student_name: "MOHAMMAD SADI",
    father_name: "MOHAMMAD JALAL UDDIN",
    mother_name: "MOSAMMAT RUBI AKTER",
    board: "CHITTAGONG",
    session: "2013-14",
    exam_type: "REGULAR",
    gender: "Male",
    result: "GPA=5.00",
    date_of_birth: "17-04-1999",
    subjects: [
      { subject_code: "101", subject_name: "BANGLA", grade: "A+" },
      { subject_code: "107", subject_name: "ENGLISH", grade: "A+" },
      { subject_code: "109", subject_name: "MATHEMATICS", grade: "A+" },
      {
        subject_code: "150",
        subject_name: "BANGLADESH AND GLOBAL STUDIES",
        grade: "A",
      },
      {
        subject_code: "111",
        subject_name: "ISLAM AND MORAL EDUCATION",
        grade: "A+",
      },
      { subject_code: "136", subject_name: "PHYSICS", grade: "A+" },
      { subject_code: "137", subject_name: "CHEMISTRY", grade: "A+" },
      { subject_code: "138", subject_name: "BIOLOGY", grade: "A+" },
      {
        subject_code: "147",
        subject_name: "PHYSICAL EDUCATION, HEALTH AND SPORTS",
        grade: "A+",
      },
      { subject_code: "126", subject_name: "HIGHER MATHEMATICS", grade: "A" },
    ],
  },
]

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function ResultPage() {
  const [year, setYear] = useState("")
  const [examination, setExamination] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [section, setSection] = useState("")
  const [group, setGroup] = useState("")
  const [studentId, setStudentId] = useState("")
  const [searched, setSearched] = useState(false)
  const [result, setResult] = useState<StudentResult | null>(null)

  const handleSearch = () => {
    const found = sampleResults.find(
      (student) =>
        student.year === year &&
        student.examination === examination &&
        student.class === studentClass &&
        student.section === section &&
        student.group === group &&
        student.student_id.toLowerCase() === studentId.toLowerCase()
    )

    setResult(found || null)
    setSearched(true)
  }

  return (
    <main>
      {/* Hero */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            <span>STUDENT RESULT PORTAL</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Search Academic Result
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Search examination results using academic filters and student ID.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Results" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* Search Form & Results */}
      <section className="bg-slate-50 px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {/* Card Header */}
            <div className="bg-[#006a4e] px-8 py-5">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <FileText className="h-5 w-5 text-emerald-100" />
                Result Finder
              </h3>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
                {/* Year */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Academic Year
                  </label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm transition-colors hover:border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-1 focus-visible:ring-emerald-600/30 shadow-none">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2014">2014</SelectItem>
                      <SelectItem value="2015">2015</SelectItem>
                      <SelectItem value="2016">2016</SelectItem>
                      <SelectItem value="2017">2017</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Examination */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Examination
                  </label>
                  <Select value={examination} onValueChange={setExamination}>
                    <SelectTrigger className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm transition-colors hover:border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-1 focus-visible:ring-emerald-600/30 shadow-none">
                      <SelectValue placeholder="Select Examination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SSC">SSC</SelectItem>
                      <SelectItem value="HSC">HSC</SelectItem>
                      <SelectItem value="JSC">JSC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Class
                  </label>
                  <Select value={studentClass} onValueChange={setStudentClass}>
                    <SelectTrigger className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm transition-colors hover:border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-1 focus-visible:ring-emerald-600/30 shadow-none">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">Class 6</SelectItem>
                      <SelectItem value="7">Class 7</SelectItem>
                      <SelectItem value="8">Class 8</SelectItem>
                      <SelectItem value="9">Class 9</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Section
                  </label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm transition-colors hover:border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-1 focus-visible:ring-emerald-600/30 shadow-none">
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                      <SelectItem value="D">Section D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Group */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Group
                  </label>
                  <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm transition-colors hover:border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-1 focus-visible:ring-emerald-600/30 shadow-none">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCIENCE">Science</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="HUMANITIES">Humanities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Student ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Student ID
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., STD-114131"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="h-10 w-full rounded-lg border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-emerald-600 focus-visible:border-emerald-600 focus-visible:ring-1 focus-visible:ring-emerald-600/30 shadow-none"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#006a4e] px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-emerald-800 active:scale-95"
              >
                <Search className="h-5 w-5" />
                Search Result
              </button>
            </div>
          </div>

          {/* Result Output */}
          {searched && result && (
            <div className="space-y-10">
              {/* Student Summary */}
              <div className="rounded-lg border border-slate-200 bg-white p-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      Student Information Summary
                    </h2>
                    <p className="mt-2 text-slate-500">
                      Official academic result information
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Printer className="h-4 w-4" />
                      Print
                    </button>

                    <button className="inline-flex items-center gap-2 rounded-lg bg-[#006a4e] px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="grid gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><span className="font-semibold">Roll No:</span> {result.roll_no}</div>
                  <div><span className="font-semibold">Registration No:</span> [NOT SHOWN]</div>
                  <div className="sm:col-span-2"><span className="font-semibold">Name:</span> {result.student_name}</div>

                  <div className="sm:col-span-2"><span className="font-semibold">Father&apos;s Name:</span> {result.father_name}</div>
                  <div className="sm:col-span-2"><span className="font-semibold">Mother&apos;s Name:</span> {result.mother_name}</div>

                  <div><span className="font-semibold">Board:</span> {result.board}</div>
                  <div><span className="font-semibold">Session:</span> {result.session}</div>
                  <div><span className="font-semibold">Group:</span> {result.group}</div>
                  <div><span className="font-semibold">Type:</span> {result.exam_type}</div>

                  <div><span className="font-semibold">Gender:</span> {result.gender}</div>
                  <div><span className="font-semibold">Result:</span> <span className="font-bold text-emerald-700">{result.result}</span></div>
                  <div><span className="font-semibold">Date of Birth:</span> {result.date_of_birth}</div>
                </div>
              </div>

              {/* Subject Table */}
              <div className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-8 py-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Subject-wise Grade / Marks
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                          Subject Code
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                          Subject Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                          Grade
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {result.subjects.map((subject) => (
                        <tr key={subject.subject_code} className="hover:bg-slate-50">
                          <td className="px-6 py-4">{subject.subject_code}</td>
                          <td className="px-6 py-4 font-medium">
                            {subject.subject_name}
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
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

          {searched && !result && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white">
                <AlertCircle className="h-7 w-7 text-rose-500" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                Result Not Found
              </h3>

              <p className="mt-3 text-slate-600">
                Please verify all academic search fields and Student ID.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
