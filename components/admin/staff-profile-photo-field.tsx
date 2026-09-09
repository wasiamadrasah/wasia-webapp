"use client"

import { useState } from "react"
import { ProfilePhotoUpload } from "./profile-photo-upload"

type StaffProfilePhotoFieldProps = {
  staffId: string
  currentPhotoUrl?: string | null
}

export function StaffProfilePhotoField({ staffId, currentPhotoUrl }: StaffProfilePhotoFieldProps) {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl || "")

  return (
    <ProfilePhotoUpload
      currentPhotoUrl={photoUrl}
      onPhotoUrlChange={setPhotoUrl}
      uploadFolder={`staffs/${staffId}`}
      label="Profile Photo"
    />
  )
}
