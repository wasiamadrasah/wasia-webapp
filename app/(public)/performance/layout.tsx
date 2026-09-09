import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Performance",
  description: "Review academic performance, results trends, institutional achievements, and student success indicators.",
  path: "/performance",
  keywords: ["school performance", "academic performance", "student achievement"],
})

export default function PerformanceLayout({ children }: { children: React.ReactNode }) {
  return children
}
