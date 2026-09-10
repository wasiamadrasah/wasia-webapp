"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type ProfilePhotoUploadProps = {
  currentPhotoUrl?: string | null
  onPhotoUrlChange?: (url: string) => void
  uploadFolder: string
  label?: string
  name?: string
  aspectRatio?: "square" | "portrait" | "video"
  className?: string
}

export function ProfilePhotoUpload({
  currentPhotoUrl,
  onPhotoUrlChange,
  uploadFolder,
  label = "Profile Photo",
  name = "profile_photo",
  aspectRatio = "square",
  className = "",
}: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPreviewUrl(currentPhotoUrl || null)
  }, [currentPhotoUrl])

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
      if (onPhotoUrlChange) {
        onPhotoUrlChange(result.url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    if (onPhotoUrlChange) {
      onPhotoUrlChange("")
    }
    setError(null)
  }

  const getDimensionClasses = () => {
    switch (aspectRatio) {
      case "portrait":
        return "h-40 w-32 rounded-xl"
      case "video":
        return "h-36 w-60 rounded-xl"
      case "square":
      default:
        return "h-32 w-32 rounded-2xl"
    }
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && <Label className="text-sm font-semibold text-foreground">{label}</Label>}

      {previewUrl ? (
        <div className="relative inline-block group">
          <div className={`relative overflow-hidden border-2 border-border bg-muted ${getDimensionClasses()}`}>
            <Image
              src={previewUrl}
              alt="Photo preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-7 w-7 rounded-full shadow-md hover:scale-110 transition-transform"
            onClick={handleRemove}
            disabled={uploading}
            title="Remove photo"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <label className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted/20 transition-all hover:border-[#075E54] hover:bg-muted/50 ${getDimensionClasses()}`}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-[#075E54]" />
                <span className="text-[11px] font-medium text-muted-foreground">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-foreground">Upload Photo</span>
                <span className="text-[10.5px] text-muted-foreground">JPG, PNG, WebP</span>
              </div>
            )}
          </label>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}

      {/* Hidden input to store the uploaded image URL in the form submission */}
      <input type="hidden" name={name} value={previewUrl || ""} />
    </div>
  )
}
