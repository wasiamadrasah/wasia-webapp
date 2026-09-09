import { notFound } from "next/navigation"
import { getSubjectById } from "@/lib/db"
import SubjectEditForm from "./subject-edit-form"

export default async function EditSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const subject = await getSubjectById(id)

  if (!subject) notFound()

  return <SubjectEditForm subject={subject} />
}
