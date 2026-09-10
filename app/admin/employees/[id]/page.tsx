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
import { EmployeeDetailView } from "@/components/admin/employee-detail-view"

type EmployeeProfilePageProps = {
  params: Promise<{ id: string }>
}

export default async function EmployeeProfilePage({ params }: EmployeeProfilePageProps) {
  const { id } = await params
  const [employee, academics, experience, training, family, addresses, governmentInfo] = await Promise.all([
    getTeacherProfile(id),
    getTeacherAcademics(id),
    getTeacherExperience(id),
    getTeacherTraining(id),
    getTeacherFamily(id),
    getTeacherAddresses(id),
    getTeacherGovernmentInfo(id),
  ])

  if (!employee) {
    notFound()
  }

  return (
    <EmployeeDetailView
      employee={employee}
      academics={academics}
      experience={experience}
      training={training}
      family={family}
      addresses={addresses}
      governmentInfo={governmentInfo}
    />
  )
}
