"use client"

import { GoverningBodyMemberRecord } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { saveGoverningBodyMemberAction } from "./actions"
import Image from "next/image"
import { UploadCloud, Trash2, RefreshCw } from "lucide-react"

const categories = [
  "President",
  "VicePresident",
  "Secretary",
  "Treasurer",
  "Auditor",
  "Chairman",
  "Principal",
  "Guardian",
  "Teacher",
  "Donor",
  "Nominee",
]

export function GoverningBodyMemberForm({
  member,
  onSuccess,
  onCancel,
}: {
  member?: GoverningBodyMemberRecord
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof member?.image_url === "string" ? member.image_url : null
  )

  function isValidImageSrc(value: unknown) {
    if (typeof value !== "string") return false
    if (value.startsWith("data:")) return true
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemovePhoto = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      let imageUrl = imagePreview ? (member?.image_url || null) : null

      // Upload image if changed
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)
        uploadFormData.append(
          "folder",
          `governing-body/${Date.now()}-${imageFile.name}`
        )
        uploadFormData.append("type", "image")

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error || "Failed to upload image")
        }

        imageUrl = payload?.url || null
      }

      const data = {
        name: formData.get("name") as string,
        designation: formData.get("designation") as string,
        category: formData.get("category") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        image_url: imageUrl,
      }

      await saveGoverningBodyMemberAction(member?.id, data)
      router.refresh()

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/pages/governing-body")
      }
    } catch (error) {
      console.error(error)
      const message = error instanceof Error ? error.message : String(error)
      alert("Failed to save member: " + message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={isLoading}
        className="hidden"
      />

      {/* Custom Image Uploader */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-foreground">Profile Photo</Label>
        
        {isValidImageSrc(imagePreview) ? (
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-3.5 shadow-2xs">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-white shadow-2xs">
              <Image
                src={imagePreview as string}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {imageFile ? imageFile.name : "Member Profile Photo"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : "Active photo"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="h-9 gap-1.5 text-sm font-semibold text-primary border-primary/30 bg-primary/10 hover:bg-primary/20"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Change</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={isLoading}
                className="h-9 gap-1.5 text-sm font-semibold text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/40 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <div className="rounded-full bg-primary/10 p-3 text-primary mb-2 group-hover:scale-105 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-foreground">
              Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">
              PNG, JPG, or WEBP (Max 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-bold text-foreground">Name *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={member?.name}
          placeholder="Full name"
          required
          disabled={isLoading}
          className="h-10 text-sm border-border"
        />
      </div>

      {/* Designation */}
      <div className="space-y-1.5">
        <Label htmlFor="designation" className="text-sm font-bold text-foreground">Designation *</Label>
        <Input
          id="designation"
          name="designation"
          defaultValue={member?.designation}
          placeholder="e.g., Chairman, Governing Body"
          required
          disabled={isLoading}
          className="h-10 text-sm border-border"
        />
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category" className="text-sm font-bold text-foreground">Category *</Label>
        <Select
          name="category"
          defaultValue={member?.category}
          disabled={isLoading}
        >
          <SelectTrigger id="category" className="h-10 text-sm border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-sm">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-bold text-foreground">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={member?.email || ""}
          placeholder="email@example.com"
          disabled={isLoading}
          className="h-10 text-sm border-border"
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-sm font-bold text-foreground">Phone</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={member?.phone || ""}
          placeholder="+880 1234 567890"
          disabled={isLoading}
          className="h-10 text-sm border-border"
        />
      </div>

      {/* Actions Footer */}
      <div className="-mx-6 -mb-6 mt-6 border-t border-border bg-muted/40 px-6 py-4 flex items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancel) {
              onCancel()
            } else {
              router.back()
            }
          }}
          disabled={isLoading}
          className="h-10 rounded-lg px-4 text-sm font-medium border-border text-foreground hover:bg-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 rounded-lg px-4 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? "Saving..." : "Save Member"}
        </Button>
      </div>
    </form>
  )
}
