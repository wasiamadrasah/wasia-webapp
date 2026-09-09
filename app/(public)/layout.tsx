import { Inter, Noto_Sans_Bengali } from "next/font/google"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import NavigationProgress from "@/components/layout/NavigationProgress"
import { getSeoSettings } from "@/lib/seo"
import { getFooterLinkSections } from "@/lib/homepage"
import "./public-site.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bangla",
})

export const revalidate = 3600

async function getSafeFooterSections() {
  try {
    return await getFooterLinkSections(20)
  } catch {
    return []
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSeoSettings()
  const footerSections = await getSafeFooterSections()
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "School"],
    name: seo.siteName,
    alternateName: seo.shortName,
    url: seo.siteUrl,
    logo: seo.logoUrl || undefined,
    image: seo.logoUrl || undefined,
    description: seo.description,
    email: seo.contactEmail || undefined,
    telephone: seo.contactPhone || undefined,
    address: seo.address
      ? {
          "@type": "PostalAddress",
          streetAddress: seo.address,
        }
      : undefined,
    sameAs: seo.socialLinks.length ? seo.socialLinks : undefined,
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo.siteName,
    alternateName: seo.shortName,
    url: seo.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${seo.siteUrl}/notices?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <div
      className="public-site"
      style={{
        "--font-sans": `${inter.style.fontFamily}, ${notoBengali.style.fontFamily}, sans-serif`,
      } as React.CSSProperties}
    >
      <NavigationProgress />
      <Navbar
        initialLogo={seo.logoUrl}
        initialInstituteName={seo.siteName}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main className="bg-background public-page-transition">
        {children}
      </main>
      <Footer
        initialFooterSections={footerSections}
        initialInstituteSettings={seo.settings}
      />
    </div>
  )
}
