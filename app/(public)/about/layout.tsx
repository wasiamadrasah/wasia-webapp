import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "আমাদের সম্পর্কে ও প্রাতিষ্ঠানিক পরিচিতি",
  description:
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার পরিচিতি, ইতিহাস, এক নজরে মাদ্রাসা, লক্ষ্য, উদ্দেশ্য ও ক্যাম্পাস সুবিধাসমূহ। EIIN: ১০৪২৩৩, কোড: ২০১৮৮।",
  path: "/about",
  keywords: [
    "আমাদের সম্পর্কে",
    "এক নজরে মাদ্রাসা",
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা",
    "ওয়াসিয়া মাদ্রাসা পরিচিতি",
    "EIIN 104233",
    "মাদ্রাসা কোড 20188",
    "চান্দগাঁও চট্টগ্রাম মাদ্রাসা",
  ],
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
