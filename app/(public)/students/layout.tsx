import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Students",
  description: "Student resources, facilities, activities, support services, and academic information.",
  path: "/students",
  keywords: ["students", "student resources", "school students"],
})

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
