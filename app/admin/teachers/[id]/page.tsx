import { notFound } from "next/navigation"
import {
  getTeacherAcademics,
  getTeacherAddresses,
  getTeacherExperience,
  getTeacherFamily,
  getTeacherGovernmentInfo,
  getTeacherProfile,
  getTeacherTraining,
} from "@/lib/db"
import { TeacherDetailView } from "@/components/admin/teacher-detail-view"

type TeacherProfilePageProps = {
  params: Promise<{ id: string }>
}

export default async function TeacherProfilePage({ params }: TeacherProfilePageProps) {
  const { id } = await params
  const [teacher, academics, experience, training, family, addresses, governmentInfo] = await Promise.all([
    getTeacherProfile(id),
    getTeacherAcademics(id),
    getTeacherExperience(id),
    getTeacherTraining(id),
    getTeacherFamily(id),
    getTeacherAddresses(id),
    getTeacherGovernmentInfo(id),
  ])

  if (!teacher) {
    notFound()
  }

  return (
    <TeacherDetailView
      teacher={teacher}
      academics={academics}
      experience={experience}
      training={training}
      family={family}
      addresses={addresses}
      governmentInfo={governmentInfo}
    />
  )
}
