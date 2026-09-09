"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type ProfilePhotoUploadProps = {
  currentPhotoUrl?: string | null
  onPhotoUrlChange: (url: string) => void
  uploadFolder: string
  label?: string
}

export function ProfilePhotoUpload({
  currentPhotoUrl,
  onPhotoUrlChange,
  uploadFolder,
  label = "Profile Photo",
}: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Invalid file type. Please upload JPEG, PNG, or WebP.")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", uploadFolder)
      formData.append("type", "image")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Upload failed")
      }

      setPreviewUrl(result.url)
      onPhotoUrlChange(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onPhotoUrlChange("")
    setError(null)
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative inline-block">
          <Image
            src={previewUrl}
            alt="Profile preview"
            width={120}
            height={120}
            unoptimized
            className="h-32 w-32 rounded-xl border-2 border-border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-7 w-7 rounded-full shadow-md"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary hover:bg-muted/60">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-xs text-muted-foreground">Upload</span>
              </>
            )}
          </label>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Accepted formats: JPEG, PNG, WebP. Max size: 5MB
      </p>

      {/* Hidden input to store the URL in the form */}
      <input type="hidden" name="profile_photo" value={previewUrl || ""} />
    </div>
  )
}
