import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Admission",
  description: "Find admission eligibility, application process, important dates, documents, and school admission guidance.",
  path: "/admission",
  keywords: ["school admission", "admission process", "student admission"],
})

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  return children
}
