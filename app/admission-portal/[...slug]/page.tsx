import { notFound } from "next/navigation"

/**
 * Catch-all for any admission portal path that doesn't match a known page.
 * Calls notFound() to render app/admission-portal/not-found.tsx
 * with the admission portal layout (navbar + footer).
 */
export default function AdmissionCatchAll() {
  notFound()
}
