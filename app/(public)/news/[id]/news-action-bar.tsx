"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  Facebook,
  Linkedin,
  MessageCircle,
  Printer,
  Twitter,
} from "lucide-react"

interface NewsActionBarProps {
  url: string
  title: string
}

export function NewsActionBar({ url, title }: NewsActionBarProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: "bg-[#1877F2] hover:bg-[#166FE5] text-white",
      Icon: Facebook,
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      bg: "bg-[#25D366] hover:bg-[#20ba59] text-white",
      Icon: MessageCircle,
    },
    {
      name: "Twitter / X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      bg: "bg-[#000000] hover:bg-[#1a1a1a] text-white",
      Icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: "bg-[#0A66C2] hover:bg-[#0956a5] text-white",
      Icon: Linkedin,
    },
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
      {/* Left: Share Icons using Lucide */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-semibold text-[#5F6B67] mr-1">
          শেয়ার করুন:
        </span>
        {shareLinks.map(({ name, href, bg, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${name}-এ শেয়ার করুন`}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-opacity hover:opacity-90 ${bg}`}
          >
            <Icon className="h-4 w-4 text-white" />
          </a>
        ))}
      </div>

      {/* Right: Print & Copy Link */}
      <div className="flex items-center gap-2">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E7E4] bg-[#F7F8F5] px-3 py-1.5 text-[14px] font-semibold text-[#17211E] transition hover:bg-[#E2E7E4]"
          title="লিংক কপি করুন"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-[#075E54]" />
              <span className="text-[#075E54]">কপি হয়েছে!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-[#5F6B67]" />
              <span>কপি লিংক</span>
            </>
          )}
        </button>

        {/* Print Button */}
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E7E4] bg-[#F7F8F5] px-3 py-1.5 text-[14px] font-semibold text-[#17211E] transition hover:bg-[#E2E7E4]"
          title="প্রিন্ট করুন"
        >
          <Printer className="h-4 w-4 text-[#5F6B67]" />
          <span>প্রিন্ট</span>
        </button>
      </div>
    </div>
  )
}

export default NewsActionBar
