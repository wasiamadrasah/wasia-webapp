import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "শিক্ষার্থী কল্যাণ ও সেবা",
  description: "ওয়াসিয়া কামিল মাদ্রাসার শিক্ষার্থীদের সুযোগ-সুবিধা, সহ-শিক্ষা কার্যক্রম, একাডেমিক সেবা ও কল্যাণমূলক তথ্য।",
  path: "/students",
  keywords: ["শিক্ষার্থী সেবা", "মাদ্রাসা শিক্ষার্থী", "সহ-শিক্ষা কার্যক্রম", "ওয়াসিয়া মাদ্রাসা সুযোগ-সুবিধা"],
})

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
