import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Governing Body",
  description: "View governing body members, school committee roles, contact details, and institutional leadership.",
  path: "/governing-body",
  keywords: ["governing body", "school committee", "school leadership"],
})

export default function GoverningBodyLayout({ children }: { children: React.ReactNode }) {
  return children
}
