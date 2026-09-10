import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "প্রাতিষ্ঠানিক নীতিমালা ও আচরণবিধি",
  description:
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার একাডেমিক নীতিমালা, শিক্ষার্থী আচরণবিধি, শৃঙ্খলা ও প্রশাসনিক নির্দেশিকাসমূহ।",
  path: "/policies",
  keywords: [
    "মাদ্রাসার নীতিমালা",
    "শিক্ষার্থী আচরণবিধি",
    "মাদ্রাসা নিয়মাবলি",
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা",
    "একাডেমিক নীতিমালা",
  ],
})

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return children
}
