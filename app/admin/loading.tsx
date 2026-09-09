/**
 * Shown instantly by Next.js App Router (Suspense streaming)
 * while switching or loading any /admin/* route.
 * Displays the 3-bar animated loader in the center of the page.
 */
export default function AdminLoading() {
  return (
    <div className="flex h-[calc(100vh-14rem)] min-h-[360px] w-full items-center justify-center">
      <div className="admin-loader" aria-label="Loading..." />
    </div>
  )
}
