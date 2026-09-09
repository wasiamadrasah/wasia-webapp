"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { bulkImportStudentsAction } from "@/app/admin/students/actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import type { AcademicClassConfigRecord } from "@/lib/db"

interface BulkImportManagerProps {
  classConfigs: AcademicClassConfigRecord[]
}

function parseCSV(text: string) {
  const lines = text.split(/\r?\n/)
  if (lines.length === 0) return []
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

  const rows: any[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values: string[] = []
    let current = ""
    let inQuotes = false
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const rowObj: any = {}
    headers.forEach((h, index) => {
      if (h) {
        rowObj[h] = values[index] !== undefined ? values[index].replace(/^"|"$/g, "") : ""
      }
    })
    rows.push(rowObj)
  }
  return rows
}

export function BulkImportManager({ classConfigs }: BulkImportManagerProps) {
  const router = useRouter()
  const [classConfigId, setClassConfigId] = React.useState("")
  const [fileData, setFileData] = React.useState<any[] | null>(null)
  const [fileName, setFileName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [errors, setErrors] = React.useState<string[]>([])
  const [feedback, setFeedback] = React.useState<{ status: "success" | "error"; message: string } | null>(null)

  const activeConfigs = React.useMemo(() => {
    return classConfigs.filter((c) => c.is_active)
  }, [classConfigs])

  const downloadTemplate = () => {
    const headers = [
      "name_en",
      "name_bn",
      "gender",
      "religion",
      "blood_group",
      "date_of_birth",
      "birth_certificate_no",
      "mobile",
      "email",
      "roll_no",
      "father_name",
      "mother_name",
      "guardian_mobile",
    ]
    const sampleRows = [
      [
        "Rakib Hasan",
        "রকিব হাসান",
        "Male",
        "Islam",
        "A+",
        "2012-05-15",
        "20121234567890123",
        "01712345678",
        "rakib@gmail.com",
        "1",
        "Kalam Hasan",
        "Razia Begum",
        "01712345679",
      ],
      [
        "Sultana Afroze",
        "সুলতানা আফরোজ",
        "Female",
        "Islam",
        "",
        "2013-09-20",
        "",
        "01812345678",
        "",
        "",
        "Kamrul Islam",
        "Laila Begum",
        "",
      ],
    ]
    const csvContent = [headers.join(","), ...sampleRows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "student_import_template.csv")
    link.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setFeedback(null)
    setErrors([])
    setFileData(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseCSV(text)
        if (parsed.length === 0) {
          setErrors(["The CSV file is empty or missing headers."])
          return
        }

        // Validate headings format
        const requiredHeaders = ["name_en", "gender"]
        const headings = Object.keys(parsed[0])
        const missing = requiredHeaders.filter((h) => !headings.includes(h))

        if (missing.length > 0) {
          setErrors([`Invalid template. Missing headers: ${missing.join(", ")}`])
          return
        }

        // Run row pre-checks
        const rowErrors: string[] = []
        parsed.forEach((row, index) => {
          const line = index + 2
          if (!row.name_en?.trim()) rowErrors.push(`Row ${line}: 'name_en' is required.`)
          if (!row.gender || !["Male", "Female", "Other"].includes(row.gender)) {
            rowErrors.push(`Row ${line}: 'gender' must be Male, Female, or Other.`)
          }
          if (row.religion && !["Islam", "Hinduism", "Buddhism", "Christianity", "Other"].includes(row.religion)) {
            rowErrors.push(`Row ${line}: 'religion' must be Islam, Hinduism, Buddhism, Christianity, or Other.`)
          }
          if (row.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(row.date_of_birth)) {
            rowErrors.push(`Row ${line}: 'date_of_birth' must be YYYY-MM-DD.`)
          }
          if (row.birth_certificate_no && !/^\d{17}$/.test(row.birth_certificate_no)) {
            rowErrors.push(`Row ${line}: 'birth_certificate_no' must be exactly 17 digits.`)
          }
          if (row.mobile && !/^01\d{9}$/.test(row.mobile)) {
            rowErrors.push(`Row ${line}: 'mobile' phone number must be 11 digits starting with 01.`)
          }
          if (row.guardian_mobile && !/^01\d{9}$/.test(row.guardian_mobile)) {
            rowErrors.push(`Row ${line}: 'guardian_mobile' phone number must be 11 digits starting with 01.`)
          }
        })

        setErrors(rowErrors)
        setFileData(parsed)
      } catch (err) {
        setErrors(["Failed to read or parse CSV file format."])
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!classConfigId) {
      setFeedback({ status: "error", message: "Please select an academic placement." })
      return
    }
    if (!fileData || fileData.length === 0) {
      setFeedback({ status: "error", message: "No data loaded to import." })
      return
    }
    if (errors.length > 0) {
      setFeedback({ status: "error", message: "Please fix all validation errors before importing." })
      return
    }

    setIsSubmitting(true)
    setProgress(10)
    setFeedback(null)

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 90) return oldProgress
        return oldProgress + Math.random() * 15
      })
    }, 500)

    try {
      await bulkImportStudentsAction(classConfigId, fileData)
      clearInterval(timer)
      setProgress(100)
      setFeedback({ status: "success", message: "Successfully imported and enrolled all students!" })
      setFileData(null)
      setFileName("")
      router.refresh()
    } catch (err) {
      clearInterval(timer)
      setProgress(0)
      setFeedback({ status: "error", message: err instanceof Error ? err.message : "Failed to import students." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      {feedback && (
        <div
          className={`rounded-xl border p-4 text-sm flex items-start gap-3 transition-all ${
            feedback.status === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
              : "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-400"
          }`}
        >
          {feedback.status === "success" ? (
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="size-5 shrink-0 text-destructive dark:text-red-400 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">
              {feedback.status === "success" ? "Success" : "Error Occurred"}
            </p>
            <p className="text-xs opacity-90">{feedback.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* left column: upload setup */}
        <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-2xs h-fit">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-foreground">Import Configuration</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Configure student placement and upload spreadsheet.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={downloadTemplate}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Download className="size-3.5" /> Download Template
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="class_config_id" className="text-sm font-semibold text-foreground">
                Academic Placement <span className="text-rose-500">*</span>
              </Label>
              <Select value={classConfigId} onValueChange={setClassConfigId}>
                <SelectTrigger id="class_config_id" className="w-full">
                  <SelectValue placeholder="Select Class Placement" />
                </SelectTrigger>
                <SelectContent>
                  {activeConfigs.map((cc) => {
                    const label = [
                      cc.session_name,
                      cc.class_name,
                      cc.section_name ? `Sec: ${cc.section_name}` : null,
                      cc.shift_name ? `Shift: ${cc.shift_name}` : null,
                      cc.group_name ? `Grp: ${cc.group_name}` : null,
                    ]
                      .filter(Boolean)
                      .join(" › ")
                    return (
                      <SelectItem key={cc.id} value={cc.id}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Upload CSV File <span className="text-rose-500">*</span>
              </Label>
              <div className="flex justify-center items-center border-2 border-dashed border-border rounded-xl p-6 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center space-y-2">
                  <UploadCloud className="size-8 mx-auto text-muted-foreground" />
                  <span className="text-sm font-medium block text-foreground">
                    {fileName ? fileName : "Click to select CSV Template File"}
                  </span>
                  <span className="text-xs text-muted-foreground">Supported file formats: CSV only</span>
                </div>
              </div>
            </div>

            {fileData && (
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                {isSubmitting && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                      <span>Importing records...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                <Button
                  onClick={handleImport}
                  disabled={isSubmitting || errors.length > 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 h-10 shadow-2xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      <span>Process Import</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* right column: logs & errors */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs h-fit min-h-[300px]">
          <h3 className="font-bold text-foreground">File Parsing Pre-check</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Realtime validation check on loaded rows.
          </p>

          <div className="mt-4 space-y-4">
            {errors.length > 0 && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive dark:text-red-400 space-y-2">
                <div className="flex gap-2 items-center text-sm font-semibold">
                  <AlertCircle className="size-4 text-destructive dark:text-red-400 shrink-0" />
                  <span>Validation Failures ({errors.length}):</span>
                </div>
                <div className="text-xs space-y-1 font-mono max-h-[200px] overflow-y-auto pr-1">
                  {errors.map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              </div>
            )}

            {fileData && errors.length === 0 && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex gap-2 items-center text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>CSV File is Valid!</span>
                </div>
                <p className="text-xs">
                  Rows parsed: <strong>{fileData.length}</strong> student records ready to be admitted.
                </p>
              </div>
            )}

            {!fileData && errors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground italic text-sm">
                <AlertTriangle className="size-8 text-muted-foreground/50 mb-2" />
                No file uploaded yet. Configure and select your CSV document to begin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
