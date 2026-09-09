"use client"

import { useState } from "react"
import { ProfilePhotoUpload } from "./profile-photo-upload"

type TeacherProfilePhotoFieldProps = {
  teacherId: string
  currentPhotoUrl?: string | null
}

export function TeacherProfilePhotoField({ teacherId, currentPhotoUrl }: TeacherProfilePhotoFieldProps) {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl || "")

  return (
    <ProfilePhotoUpload
      currentPhotoUrl={photoUrl}
      onPhotoUrlChange={setPhotoUrl}
      uploadFolder={`teachers/${teacherId}`}
      label="Profile Photo"
    />
  )
}
