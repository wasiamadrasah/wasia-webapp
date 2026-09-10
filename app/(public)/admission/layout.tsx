import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "ভর্তি সংক্রান্ত তথ্যাবলী",
  description: "ওয়াসিয়া কামিল মাদ্রাসায় নতুন শিক্ষাবর্ষে ভর্তি প্রক্রিয়া, যোগ্যতা, প্রয়োজনীয় কাগজপত্র ও নিয়মাবলী।",
  path: "/admission",
  keywords: ["মাদ্রাসা ভর্তি", "ওয়াসিয়া মাদ্রাসা ভর্তি তথ্য", "দাখিল ভর্তি", "আলিম ভর্তি", "হিফজুল কুরআন ভর্তি"],
})

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  return children
}
