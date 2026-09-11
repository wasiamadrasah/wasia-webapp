import React from "react"
import { PageHeader } from "@/components/digicampus/page-header"
import { IconSettings, IconClock, IconSparkles } from "@tabler/icons-react"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

const SETTINGS_MODULES: Record<string, { title: string; description: string }> = {
  notifications: {
    title: "Notification Settings",
    description: "Configure system alerts, broadcast channels, and target role notification preferences.",
  },
  whatsapp: {
    title: "WhatsApp Messaging",
    description: "Connect WhatsApp Business API gateways, messaging templates, and automated alerts.",
  },
  sms: {
    title: "SMS Settings",
    description: "Manage SMS gateway providers, sender IDs, delivery rates, and automated SMS triggers.",
  },
  email: {
    title: "Email Settings",
    description: "Configure SMTP mail servers, email templates, and automated system communication.",
  },
  "payment-methods": {
    title: "Payment Methods",
    description: "Setup payment gateways (bKash, Nagad, SSLCommerz, Stripe) for fees and online admissions.",
  },
  "front-cms": {
    title: "Front CMS Settings",
    description: "Configure public portal branding, layout settings, SEO meta, and portal accessibility.",
  },
  "roles-permissions": {
    title: "Roles & Permissions",
    description: "Define granular access control, custom roles, and permission matrices across modules.",
  },
  "backup-restore": {
    title: "Backup & Restore",
    description: "Automated database backups, manual export/import, snapshot scheduling, and restoration.",
  },
  system: {
    title: "System Settings",
    description: "Manage global system configurations, server parameters, and environment preferences.",
  },
  "system-settings": {
    title: "System Settings",
    description: "Manage global system configurations, server parameters, and environment preferences.",
  },
  languages: {
    title: "Languages & Localization",
    description: "Manage multilingual translations, default system locale, and bilingual portal texts.",
  },
}

export default async function SettingsModulePlaceholderPage({ params }: Props) {
  const { slug } = await params
  const moduleInfo = SETTINGS_MODULES[slug] || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "Module configuration and management settings.",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={moduleInfo.title}
        description={moduleInfo.description}
      />

      <div className="rounded-2xl border border-border/80 bg-card p-8 md:p-12 text-center shadow-xs">
        <div className="mx-auto size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 shadow-xs">
          <IconSettings className="size-8 animate-[spin_12s_linear_infinite]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
          <IconClock className="size-3.5" />
          <span>Under Development</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          {moduleInfo.title}
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed mb-6">
          {moduleInfo.description}
        </p>

        <div className="p-4 max-w-md mx-auto rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-center gap-2 justify-center">
          <IconSparkles className="size-4 text-primary shrink-0" />
          <span>This feature module is scheduled for development in an upcoming sprint.</span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/admin/iconfig"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border"
          >
            Institute Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
