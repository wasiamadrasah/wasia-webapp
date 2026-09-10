import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)",
  description:
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার ভর্তি, বিভাগসমূহ, হিফজ শাখা, আবাসিক সুবিধা ও বেতন সম্পর্কিত সচরাচর জিজ্ঞাসিত প্রশ্নাবলি।",
  path: "/faq",
  keywords: [
    "মাদ্রাসা সাধারণ জিজ্ঞাসা",
    "ওয়াসিয়া মাদ্রাসা FAQ",
    "ভর্তি প্রশ্নোত্তর",
    "হিফজ ও আবাসিক তথ্য",
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা",
  ],
})

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
