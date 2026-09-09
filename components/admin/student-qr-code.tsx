"use client"

import * as React from "react"
import QRCode from "qrcode"
import Image from "next/image"

type StudentQRCodeProps = {
  value: string
  size?: number
  className?: string
  altText?: string
}

export function StudentQRCode({
  value,
  size = 96,
  className = "",
  altText = "Student QR Code",
}: StudentQRCodeProps) {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true
    if (value) {
      QRCode.toDataURL(value, {
        width: size * 2, // 2x for retina crispness
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      })
        .then((url) => {
          if (isMounted) {
            setDataUrl(url)
          }
        })
        .catch((err) => {
          console.error("Failed to generate QR Code:", err)
        })
    }
    return () => {
      isMounted = false
    }
  }, [value, size])

  if (!value) return null

  if (!dataUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/40 rounded-lg border border-border/60 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[10px] text-muted-foreground">Generating...</span>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center p-1.5 bg-white rounded-lg border border-border shadow-2xs ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={dataUrl}
        alt={altText}
        width={size - 8}
        height={size - 8}
        unoptimized
        className="size-full object-contain"
      />
    </div>
  )
}
