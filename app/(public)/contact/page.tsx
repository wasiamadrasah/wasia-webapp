import ContactForm from "./ContactForm"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { createPageMetadata } from "@/lib/seo"
import { Outfit } from "next/font/google"
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Map,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact the school office for address, phone, email, office hours, map location, and enquiry support.",
  path: "/contact",
  keywords: ["school contact", "school address", "school phone", "school email"],
})

export default async function ContactPage() {
  const instituteSettings = await getInstituteSettings()

  const contactDetails = [
    {
      icon: MapPin,
      label: "Address",
      value: instituteSettings.contact.address?.trim() || "Bakalia, Chattogram, Bangladesh",
    },
    {
      icon: Phone,
      label: "Phone",
      values: [
        instituteSettings.contact.telephone?.trim()
          ? { text: instituteSettings.contact.telephone.trim(), href: `tel:${instituteSettings.contact.telephone.trim()}` }
          : null,
        instituteSettings.contact.mobile?.trim()
          ? { text: instituteSettings.contact.mobile.trim(), href: `tel:${instituteSettings.contact.mobile.trim()}` }
          : null,
      ].filter((item): item is { text: string; href: string } => Boolean(item)),
    },
    {
      icon: Mail,
      label: "Email",
      values: instituteSettings.contact.email?.trim()
        ? [{ text: instituteSettings.contact.email.trim(), href: `mailto:${instituteSettings.contact.email.trim()}` }]
        : [{ text: "info@pbcchs.edu.bd", href: "mailto:info@pbcchs.edu.bd" }],
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: instituteSettings.contact.officeHours?.trim() || "9:00 AM - 04:00 PM",
    },
  ] as const

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: instituteSettings.social.facebook?.trim() || "https://facebook.com" },
    { icon: Youtube, label: "YouTube", href: instituteSettings.social.youtube?.trim() || "https://youtube.com" },
    { icon: Linkedin, label: "LinkedIn", href: instituteSettings.social.linkedin?.trim() || "https://linkedin.com" },
    { icon: Instagram, label: "Instagram", href: instituteSettings.social.instagram?.trim() || "https://instagram.com" },
  ] as const

  const mapEmbedSrc =
    instituteSettings.contact.googleMapEmbed?.trim() ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.070642167835!2d91.85560447599465!3d22.35096134105586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2716e460ed05%3A0xa60a2ca0d92dc26b!2sPurba%20Bakalia%20City%20Corporation%20High%20School!5e0!3m2!1sen!2sbd!4v1772984417541!5m2!1sen!2sbd"

  return (
    <main>
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <Mail className="h-3.5 w-3.5 text-emerald-400" />
            <span>CONTACT DESK</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Get in <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Have queries about admissions, facilities, or feedback? Our dedicated administration team is here to support you at every step.
          </p>

          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Contact" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 py-20">

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            <div className="space-y-6 lg:col-span-2 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#021e17] via-[#01251e] to-slate-900 p-6 sm:p-8 text-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)]">
                <div className="space-y-3">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase text-emerald-200">
                    Direct Channels
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">Contact Information</h2>
                  <p className="max-w-sm text-sm leading-6 text-teal-50/80">
                    Reach the office, plan a campus visit, or send urgent questions through the fastest channel.
                  </p>
                </div>

                <ul className="mt-8 space-y-5">
                  {contactDetails.map((item) => {
                    const Icon = item.icon

                    return (
                      <li key={item.label} className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 px-4 py-4 shadow-inner backdrop-blur-sm">
                        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-200">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="mb-1 block text-[11px] font-medium uppercase text-emerald-200/80">
                            {item.label}
                          </span>
                          {"values" in item ? (
                            <div className="space-y-1.5">
                              {item.values.map((entry) => (
                                <a
                                  key={entry.text}
                                  href={entry.href}
                                  className="block text-sm leading-6 text-white transition-colors hover:text-emerald-200"
                                >
                                  {entry.text}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="block text-sm leading-6 text-white">{item.value}</span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="mb-4 text-[11px] font-semibold uppercase text-emerald-200/80">Follow Us</p>
                  <div className="flex items-center gap-3">
                    {socialLinks.map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.03),0_20px_40px_-12px_rgba(15,23,42,0.05)]">
            <div className="mb-8 flex flex-col gap-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase text-emerald-700 ring-1 ring-emerald-100">
                  <Map className="h-3.5 w-3.5" />
                  Campus Location
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Find Us on the Map</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                  Visit our campus in person or use the map below to plan the quickest route.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 shadow-inner">
              <div className="overflow-hidden rounded-lg border border-white/80 bg-white">
                <div className="h-80 w-full sm:h-96 [&>iframe]:block [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0">
                  <iframe
                    src={mapEmbedSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    title="School location on Google Maps"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
