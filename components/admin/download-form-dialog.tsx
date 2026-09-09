"use client"

import { useState, useEffect } from "react"
import { createDownloadAction, updateDownloadAction, getDownloadForEditAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DownloadFormDialogProps {
  categories: Array<{ name: string; is_active: boolean }>
  trigger?: React.ReactNode
  downloadId?: string
  initialData?: {
    title?: string
    description?: string
    file_url?: string
    file_name?: string
    download_type?: string
    publish_date?: string
    published?: boolean
  }
  onSuccess?: () => void
  isEdit?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DownloadFormDialog({
  categories,
  trigger,
  downloadId,
  initialData,
  onSuccess,
  isEdit = false,
  open: controlledOpen,
  onOpenChange,
}: DownloadFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState(initialData)
  const [isPublished, setIsPublished] = useState(initialData?.published !== false)
  const isLoading = isEdit && isOpen && !!downloadId && !data?.file_url

  // Fetch full download data when dialog opens in edit mode
  useEffect(() => {
    if (isEdit && isOpen && downloadId && !data?.file_url) {
      getDownloadForEditAction(downloadId)
        .then((result) => {
          setData({
            title: result.title,
            description: result.description || "",
            file_url: result.file_url,
            file_name: result.file_name || "",
            download_type: result.download_type,
            published: result.published,
          })
          setIsPublished(result.published)
        })
        .catch((error) => {
          console.error("Failed to fetch download:", error)
        })
    }
  }, [isEdit, isOpen, downloadId, data?.file_url, initialData])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setData(initialData)
      setIsPublished(initialData?.published !== false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("published", isPublished ? "true" : "false")

      if (isEdit && downloadId) {
        await updateDownloadAction(downloadId, formData)
      } else {
        await createDownloadAction(formData)
      }

      // Close dialog and reset state
      setIsOpen(false)
      setData(initialData)
      setIsPublished(initialData?.published !== false)
      onSuccess?.()
    } catch (error) {
      // Redirect errors are expected (NEXT_REDIRECT)
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        setIsOpen(false)
        return
      }
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>{isEdit ? "Edit Download" : "Add New Download"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isEdit
                ? "Update the download details and publish when ready."
                : "Upload or link a file for download and publish when ready."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading download details...</div>
          ) : (
            <>
              <div className="space-y-5 py-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">File Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Enter download title"
                    defaultValue={data?.title || ""}
                  />
                </div>

                {/* File URL */}
                <div className="space-y-2">
                  <Label htmlFor="file_url">File URL *</Label>
                  <Input
                    id="file_url"
                    name="file_url"
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/d/... or your file URL"
                    defaultValue={data?.file_url || ""}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="download_type">Category</Label>
                  <Select name="download_type" defaultValue={data?.download_type || "general"}>
                    <SelectTrigger id="download_type" className="w-full">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Published Checkbox */}
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="published"
                      checked={isPublished}
                      onCheckedChange={(checked) => setIsPublished(!!checked)}
                    />
                    <FieldLabel htmlFor="published">
                      Publish immediately
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEdit ? "Update Download" : "Add Download"}
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
