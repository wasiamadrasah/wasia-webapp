import { headers } from "next/headers"
import Link from "next/link"
import { Home, BookOpen, Search } from "lucide-react"

export default async function GlobalNotFound() {
  const headersList = await headers()
  const host = headersList.get("host") ?? ""
  const isAdmissionPortal = host.startsWith("admission.")
  const isWorkspace = host.startsWith("console.") || host.startsWith("workspace.") || host.startsWith("admin.")

  if (isWorkspace) {
    /* ── Admin / Workspace portal 404 (indigo/navy theme) ── */
    return (
      <html lang="en" suppressHydrationWarning className="dark">
        <body suppressHydrationWarning style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#090d16", color: "#f8fafc" }}>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "3rem 1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "clamp(6rem,20vw,12rem)",
                fontWeight: 900,
                lineHeight: 1,
                color: "#1e1b4b",
                margin: 0,
                userSelect: "none",
              }}
            >
              404
            </p>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "-1rem 0 0.75rem",
              }}
            >
              Admin Page Not Found
            </h1>
            <p style={{ color: "#94a3b8", maxWidth: "28rem", margin: "0 auto 2rem" }}>
              The admin page or resource you requested does not exist or has been moved.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "#4F46E5",
                  color: "#fff",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "0.75rem",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                <Home size={16} /> Admin Dashboard
              </Link>
            </div>
          </div>
        </body>
      </html>
    )
  }

  if (isAdmissionPortal) {
    /* ── Admission portal 404 (light blue theme) ── */
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#eff6ff" }}>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "3rem 1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "clamp(6rem,20vw,12rem)",
                fontWeight: 900,
                lineHeight: 1,
                color: "#bfdbfe",
                margin: 0,
                userSelect: "none",
              }}
            >
              404
            </p>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#1e293b",
                margin: "-1rem 0 0.75rem",
              }}
            >
              Page Not Found
            </h1>
            <p style={{ color: "#64748b", maxWidth: "28rem", margin: "0 auto 2rem" }}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "#2563eb",
                  color: "#fff",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "0.75rem",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                <Home size={16} /> Portal Home
              </Link>
              <Link
                href="/guideline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1.5px solid #bfdbfe",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "0.75rem",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                <BookOpen size={16} /> Admission Guideline
              </Link>
            </div>
          </div>
        </body>
      </html>
    )
  }

  /* ── Public frontend 404 (emerald theme) ── */
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f8fafc" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "3rem 1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "clamp(6rem,20vw,12rem)",
              fontWeight: 900,
              lineHeight: 1,
              color: "#f1f5f9",
              margin: 0,
              userSelect: "none",
            }}
          >
            404
          </p>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1e293b",
              margin: "-1rem 0 0.75rem",
            }}
          >
            Page Not Found
          </h1>
          <p style={{ color: "#64748b", maxWidth: "28rem", margin: "0 auto 2rem" }}>
            The page you&apos;re looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#059669",
                color: "#fff",
                padding: "0.65rem 1.25rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              <Home size={16} /> Back to Home
            </Link>
            <Link
              href="/notices"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#fff",
                color: "#374151",
                border: "1.5px solid #e2e8f0",
                padding: "0.65rem 1.25rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              <Search size={16} /> Browse Notices
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
