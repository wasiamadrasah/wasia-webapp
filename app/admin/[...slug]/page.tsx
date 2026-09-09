import { notFound } from "next/navigation"

/**
 * Catch-all route for any admin portal path that does not match a known route.
 * Calls notFound() to render app/admin/not-found.tsx within the AdminLayout.
 */
export default function AdminCatchAll() {
  notFound()
}
