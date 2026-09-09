import { notFound } from "next/navigation"
import {
  getTeacherAcademics,
  getTeacherAddresses,
  getTeacherExperience,
  getTeacherFamily,
  getTeacherGovernmentInfo,
  getStaffProfile,
  getTeacherTraining,
} from "@/lib/db"
import { StaffDetailView } from "@/components/admin/staff-detail-view"

type StaffProfilePageProps = {
  params: Promise<{ id: string }>
}

export default async function StaffProfilePage({ params }: StaffProfilePageProps) {
  const { id } = await params
  const [staff, academics, experience, training, family, addresses, governmentInfo] = await Promise.all([
    getStaffProfile(id),
    getTeacherAcademics(id),
    getTeacherExperience(id),
    getTeacherTraining(id),
    getTeacherFamily(id),
    getTeacherAddresses(id),
    getTeacherGovernmentInfo(id),
  ])

  if (!staff) {
    notFound()
  }

  return (
    <StaffDetailView
      staff={staff}
      academics={academics}
      experience={experience}
      training={training}
      family={family}
      addresses={addresses}
      governmentInfo={governmentInfo}
    />
  )
}
