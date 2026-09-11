"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, UploadCloud, X, Image as ImageIcon, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type NewsFeaturedImageUploadProps = {
  initialUrl?: string | null
  inputName?: string
  uploadFolder?: string
}

export function NewsFeaturedImageUpload({
  initialUrl,
  inputName = "featured_image_url",
  uploadFolder = "news/featured",
}: NewsFeaturedImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(initialUrl || "")
  const [error, setError] = useState<string>("")

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, WebP).")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or less.")
      return
    }

    setError("")
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

      if (!response.ok || !result?.success || !result?.url) {
        throw new Error(result?.error || "Failed to upload image")
      }

      setPreviewUrl(result.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload image")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="w-full space-y-3">
      {previewUrl ? (
        /* Image Active Preview Card */
        <div className="relative group w-full rounded-xl border border-border bg-muted/40 p-3 transition-all hover:shadow-md overflow-hidden">
          <div className="relative h-48 w-full rounded-lg overflow-hidden border border-border bg-white">
            <Image
              src={previewUrl}
              alt="Featured image preview"
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <label
                htmlFor="featured-image-upload-change"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-foreground hover:bg-white font-semibold text-xs transition-colors shadow-sm"
              >
                <UploadCloud className="h-3.5 w-3.5 text-primary" />
                <span>Replace</span>
              </label>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 gap-1.5 text-xs font-semibold px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                onClick={() => {
                  setPreviewUrl("")
                  setError("")
                }}
                disabled={uploading}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </Button>
            </div>
          </div>
          <input
            id="featured-image-upload-change"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      ) : (
        /* Empty Upload Zone */
        <div className="relative w-full">
          <label
            htmlFor="featured-image-upload"
            className={`group relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed border-border bg-muted/40 p-6 text-center transition-all cursor-pointer hover:border-primary hover:bg-primary/5 ${
              uploading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <UploadCloud className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {uploading ? "Uploading image..." : "Click to upload featured image"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or WebP up to 5MB
                </p>
              </div>
            </div>
            <input
              id="featured-image-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}

      <input type="hidden" name={inputName} value={previewUrl} />
    </div>
  )
}