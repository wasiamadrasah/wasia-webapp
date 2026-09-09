import { ImageResponse } from "next/og"

export const runtime = "edge"

const fallbackSiteName = "Purba Bakalia City Corporation High School"
const fallbackShortName = "PBCCHS"
const fallbackDescription = "Official school updates, notices, teachers, events, admission information, and results."

function plainText(value?: string | null, maxLength = 160) {
  const text = (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trim()}...`
}

function readParam(searchParams: URLSearchParams, key: string, fallback: string, maxLength: number) {
  const value = plainText(searchParams.get(key), maxLength)
  return value || fallback
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://pbcchs.edu.bd"
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || fallbackSiteName
  const shortName = process.env.NEXT_PUBLIC_SITE_SHORT_NAME || fallbackShortName
  const label = readParam(searchParams, "label", shortName, 42)
  const title = readParam(searchParams, "title", siteName, 96)
  const description = readParam(searchParams, "description", fallbackDescription, 150)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #06281f 0%, #064e3b 52%, #0f766e 100%)",
          color: "white",
          padding: 64,
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 15%, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 85% 70%, rgba(16,185,129,0.35), transparent 30%)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#a7f3d0" }}>
              {label}
            </div>
            <div style={{ width: 96, height: 6, background: "#34d399", borderRadius: 999 }} />
          </div>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              border: "2px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 800,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            {shortName.slice(0, 1).toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative", maxWidth: 980 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 800, letterSpacing: 0 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#d1fae5", maxWidth: 940 }}>
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            fontSize: 24,
            color: "#ccfbf1",
          }}
        >
          <span>{siteName}</span>
          <span>{new URL(siteUrl).host}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
