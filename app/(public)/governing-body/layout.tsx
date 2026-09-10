import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "সম্মানিত পরিচালনা পর্ষদ",
  description: "ওয়াসিয়া কামিল মাদ্রাসার সম্মানিত পরিচালনা পর্ষদ, নির্বাহী কমিটি ও দায়িত্বশীল ব্যক্তিবর্গের তালিকা।",
  path: "/governing-body",
  keywords: ["পরিচালনা পর্ষদ", "গভর্নিং বডি", "ওয়াসিয়া মাদ্রাসা কমিটি", "মাদ্রাসার নেতৃত্ব"],
})

export default function GoverningBodyLayout({ children }: { children: React.ReactNode }) {
  return children
}
