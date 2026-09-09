import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Results",
  description: "Find result information, exam performance, result publication details, and student achievement updates.",
  path: "/results",
  keywords: ["school results", "exam results", "student results"],
})

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children
}
