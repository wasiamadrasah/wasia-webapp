import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "FAQ",
  description: "Frequently asked questions about academics, admission, fees, school hours, contact, and student support.",
  path: "/faq",
  keywords: ["school faq", "frequently asked questions", "school information"],
})

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
