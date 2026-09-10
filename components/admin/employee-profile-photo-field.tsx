"use client"

import { useState } from "react"
import { ProfilePhotoUpload } from "./profile-photo-upload"

type EmployeeProfilePhotoFieldProps = {
  employeeId: string
  currentPhotoUrl?: string | null
}

export function EmployeeProfilePhotoField({ employeeId, currentPhotoUrl }: EmployeeProfilePhotoFieldProps) {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl || "")

  return (
    <ProfilePhotoUpload
      currentPhotoUrl={photoUrl}
      onPhotoUrlChange={setPhotoUrl}
      uploadFolder={`employees/${employeeId}`}
      label="Profile Photo"
    />
  )
}
