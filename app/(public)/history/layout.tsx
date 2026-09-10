import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "মাদ্রাসার সংক্ষিপ্ত ইতিহাস ও পটভূমি",
  description: "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার ঐতিহাসিক পটভূমি, দ্বীনি শিক্ষার ঐতিহ্য ও প্রাতিষ্ঠানিক অগ্রযাত্রার মাইলফলক।",
  path: "/history",
  keywords: ["মাদ্রাসার ইতিহাস", "ওয়াসিয়া মাদ্রাসা পটভূমি", "দ্বীনি শিক্ষার ঐতিহ্য", "ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা"],
})

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
