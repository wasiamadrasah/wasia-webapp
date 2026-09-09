import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"
import { createSupabaseAdminClient } from "@/lib/db"
import LogoutButton from "@/components/student/logout-button"
import { User, Mail, ShieldAlert, Award, Calendar, BookOpen, UserCheck, Phone } from "lucide-react"

export default async function StudentDashboardPage() {
  const session = await getAuthSession()

  if (session?.user?.role !== "student") {
    redirect("/student/login")
  }

  const supabase = createSupabaseAdminClient()

  // Fetch student profile details
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, student_uid, name_en, name_bn, email, gender, religion, blood_group, date_of_birth, mobile, status")
    .eq("id", session.user.id)
    .maybeSingle()

  if (studentError || !student) {
    console.error("Error fetching student profile:", studentError)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md w-full shadow-sm text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-slate-500 mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Profile Error</h1>
          <p className="text-sm text-slate-500 mb-6">Unable to load your student profile information.</p>
          <LogoutButton />
        </div>
      </div>
    )
  }

  // Fetch active enrollment details if any
  const { data: enrollment } = await supabase
    .from("student_enrollments")
    .select("roll_no, academic_class_config_id")
    .eq("student_id", student.id)
    .eq("enrollment_status", "Active")
    .maybeSingle()

  let classInfo = null
  if (enrollment) {
    const { data: classConfig } = await supabase
      .from("academic_class_configs")
      .select(`
        id,
        classes (name),
        sections (name)
      `)
      .eq("id", enrollment.academic_class_config_id)
      .maybeSingle()

    if (classConfig) {
      classInfo = {
        rollNo: enrollment.roll_no,
        className: (classConfig.classes as any)?.name || "Unknown",
        sectionName: (classConfig.sections as any)?.name || "Unknown",
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* Portal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#006a4e] text-lg font-bold text-white shadow-sm">
              S
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Student Portal</h1>
              <p className="text-xs text-slate-500 mt-1">Purba Bakalia City Corporation High School</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Portal Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#006a4e] to-emerald-700 rounded-3xl p-6 md:p-8 text-white shadow-sm mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {student.name_en}!
          </h2>
          <p className="mt-2 text-emerald-100 max-w-xl text-sm leading-relaxed">
            Here you can find your academic profile, details of class enrollment, and information from the school management.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Profile Info Card */}
          <section className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="size-5 text-[#006a4e]" />
                Personal Profile
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">English Name</p>
                  <p className="text-base font-medium text-slate-900 mt-1">{student.name_en}</p>
                </div>
                {student.name_bn && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bangla Name</p>
                    <p className="text-base font-medium text-slate-900 mt-1">{student.name_bn}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student UID</p>
                  <p className="text-base font-mono font-medium text-slate-900 mt-1">{student.student_uid}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {student.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender</p>
                  <p className="text-base font-medium text-slate-900 mt-1">{student.gender}</p>
                </div>
                {student.religion && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Religion</p>
                    <p className="text-base font-medium text-slate-900 mt-1">{student.religion}</p>
                  </div>
                )}
                {student.mobile && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Mobile</p>
                    <p className="text-base font-medium text-slate-900 mt-1 flex items-center gap-1">
                      <Phone className="size-4 text-slate-400" />
                      {student.mobile}
                    </p>
                  </div>
                )}
                {student.email && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-base font-medium text-slate-900 mt-1 flex items-center gap-1">
                      <Mail className="size-4 text-slate-400" />
                      {student.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sidebar / Enrollment info card */}
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Award className="size-5 text-[#006a4e]" />
                Academic Enrollment
              </h3>
              {classInfo ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Academic Class</span>
                    <span className="text-sm font-semibold text-slate-900">{classInfo.className}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Class Section</span>
                    <span className="text-sm font-semibold text-slate-900">Section {classInfo.sectionName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500">Roll Number</span>
                    <span className="text-sm font-mono font-bold text-[#006a4e]">{classInfo.rollNo}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <BookOpen className="mx-auto size-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">No active enrollment record</p>
                  <p className="text-xs mt-1">Please contact administration to enroll in a class.</p>
                </div>
              )}
            </div>

            {/* Quick Actions/Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Calendar className="size-5 text-[#006a4e]" />
                Quick Info
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This is a secure page. Only active student accounts can access this portal workspace. Please log out when finishing your session.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
