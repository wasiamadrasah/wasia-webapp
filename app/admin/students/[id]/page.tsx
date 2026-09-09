import { notFound } from "next/navigation"
import { getStudentById } from "@/lib/db"
import { StudentDetailView } from "@/components/admin/student-detail-view"

type StudentProfilePageProps = {
  params: Promise<{ id: string }>
}

export default async function StudentProfilePage({ params }: StudentProfilePageProps) {
  const { id } = await params
  const data = await getStudentById(id)

  if (!data) {
    notFound()
  }

  const { student, guardians, addresses, previousAcademics, documents, enrollments } = data

  return (
    <StudentDetailView
      student={student}
      guardians={guardians}
      addresses={addresses}
      previousAcademics={previousAcademics}
      documents={documents}
      enrollments={enrollments || []}
    />
  )
}

