import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "History",
  description: "Explore the school's history, institutional milestones, achievements, and development timeline.",
  path: "/history",
  keywords: ["school history", "institution history", "school milestones"],
})

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
