import ContactForm from "./ContactForm"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"
import { createPageMetadata } from "@/lib/seo"
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "যোগাযোগ",
  description: "ওয়াসিয়া কামিল মাদ্রাসার ঠিকানা, ফোন, ইমেইল, অফিস সময় এবং গুগল ম্যাপ অবস্থান। যেকোনো তথ্য বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন।",
  path: "/contact",
  keywords: ["মাদ্রাসা যোগাযোগ", "ওয়াসিয়া মাদ্রাসা ঠিকানা", "মাদ্রাসা ফোন নম্বর", "মাদ্রাসা ইমেইল"],
})

export default async function ContactPage() {
  const instituteSettings = await getInstituteSettings()

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া কামিল মাদ্রাসা"

  const contactDetails = [
    {
      icon: MapPin,
      label: "ক্যাম্পাস ঠিকানা",
      value:
        instituteSettings.contact.address?.trim() ||
        "ওয়াসিয়া কামিল মাদ্রাসা ক্যাম্পাস, বাংলাদেশ",
    },
    {
      icon: Phone,
      label: "ফোন / মোবাইল",
      values: [
        instituteSettings.contact.telephone?.trim()
          ? {
              text: instituteSettings.contact.telephone.trim(),
              href: `tel:${instituteSettings.contact.telephone.trim()}`,
            }
          : null,
        instituteSettings.contact.mobile?.trim()
          ? {
              text: instituteSettings.contact.mobile.trim(),
              href: `tel:${instituteSettings.contact.mobile.trim()}`,
            }
          : null,
      ].filter((item): item is { text: string; href: string } => Boolean(item)),
      fallback: "+৮৮০১৭০০-০০০০০০",
    },
    {
      icon: Mail,
      label: "অফিসিয়াল ইমেইল",
      values: instituteSettings.contact.email?.trim()
        ? [
            {
              text: instituteSettings.contact.email.trim(),
              href: `mailto:${instituteSettings.contact.email.trim()}`,
            },
          ]
        : [{ text: "info@wasiamadrasah.edu.bd", href: "mailto:info@wasiamadrasah.edu.bd" }],
    },
    {
      icon: Clock,
      label: "দাপ্তরিক সময়সূচি",
      value: instituteSettings.contact.officeHours?.trim() || "শনিবার – বৃহস্পতিবার: সকাল ৯:০০ – বিকাল ৪:০০",
    },
  ]

  const socialLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      href: instituteSettings.social.facebook?.trim() || "https://facebook.com",
    },
    {
      icon: Youtube,
      label: "YouTube",
      href: instituteSettings.social.youtube?.trim() || "https://youtube.com",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: instituteSettings.social.instagram?.trim() || "https://instagram.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: instituteSettings.social.linkedin?.trim() || "https://linkedin.com",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: instituteSettings.social.twitter?.trim() || "https://twitter.com",
    },
  ]

  const mapEmbedSrc =
    instituteSettings.contact.googleMapEmbed?.trim() ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.070642167835!2d91.85560447599465!3d22.35096134105586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2716e460ed05%3A0xa60a2ca0d92dc26b!2sPurba%20Bakalia%20City%20Corporation%20High%20School!5e0!3m2!1sen!2sbd!4v1772984417541!5m2!1sen!2sbd"

  return (
    <main className="bg-[#F0F7F5]">
      {/* Global Public Hero Banner */}
      <PublicHero
        title="আমাদের সাথে যোগাযোগ করুন"
        subtitle="ভর্তি তথ্য, একাডেমিক পরামর্শ, প্রশাসনিক সেবা কিংবা যেকোনো মতামতের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।"
        badgeText="যোগাযোগ ও অনুসন্ধান"
        badgeIcon={Mail}
        breadcrumbCurrent="যোগাযোগ"
      />

      {/* Main Content Section - Soft Institutional Canvas (#F0F7F5) */}
      <section className="bg-[#F0F7F5] py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right: Contact Information Card (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="rounded-xl bg-[#064A42] p-6 sm:p-8 text-white shadow-sm">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[14px] font-semibold text-[#B68A18]">
                    সরাসরি যোগাযোগ
                  </div>
                  <h2 className="font-heading font-bold text-2xl text-white">
                    মাদ্রাসার ঠিকানা ও মাধ্যম
                  </h2>
                  <p className="text-[15px] leading-relaxed text-[#DCEEE9]">
                    {instituteName} ক্যাম্পাসে সরাসরি আগমন অথবা দ্রুততম যোগাযোগের তথ্যাবলী নিচে দেওয়া হলো।
                  </p>
                </div>

                <ul className="mt-6 space-y-4">
                  {contactDetails.map((item) => {
                    const Icon = item.icon

                    return (
                      <li
                        key={item.label}
                        className="flex items-start gap-3.5 rounded-lg bg-white/5 p-3.5 transition-colors hover:bg-white/10"
                      >
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#075E54] text-[#B68A18]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="mb-0.5 block text-[14px] font-semibold uppercase tracking-wider text-[#A3BFB8]">
                            {item.label}
                          </span>
                          {"values" in item && item.values && item.values.length > 0 ? (
                            <div className="space-y-1">
                              {item.values.map((entry) => (
                                <a
                                  key={entry.text}
                                  href={entry.href}
                                  className="block text-[15px] text-white transition-colors hover:text-[#B68A18]"
                                >
                                  {entry.text}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="block text-[15px] text-white leading-relaxed">
                              {"value" in item ? item.value : item.fallback}
                            </span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>

                {/* Social Connect in Card */}
                <div className="mt-6 pt-2">
                  <p className="mb-3 text-[14px] font-semibold text-[#A3BFB8]">
                    সামাজিক যোগাযোগ মাধ্যম:
                  </p>
                  <div className="flex items-center gap-2.5">
                    {socialLinks.map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-all duration-200 hover:bg-[#B68A18] hover:text-white"
                        aria-label={label}
                        title={label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 rounded-xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3 py-1 text-[14px] font-semibold text-[#075E54]">
                  <Navigation className="h-3.5 w-3.5" />
                  <span>ক্যাম্পাস অবস্থান</span>
                </div>
                <h2 className="font-heading font-bold mt-3 text-2xl sm:text-3xl text-[#17211E]">
                  গুগল ম্যাপে আমাদের অবস্থান
                </h2>
                <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-[#5F6B67]">
                  সরাসরি মাদ্রাসায় আসার সুবিধার্থে নিচের মানচিত্র নির্দেশনাটি অনুসরণ করুন।
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#E2E7E4] bg-[#F7F8F5]">
              <div className="h-80 w-full sm:h-96 md:h-[420px] [&>iframe]:block [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0">
                <iframe
                  src={mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  title="Madrasah Location Map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
