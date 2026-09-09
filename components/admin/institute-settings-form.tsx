"use client"

import { useState } from "react"
import { toast } from "@/components/ui/sonner"
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconDeviceLandlinePhone,
  IconEye,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShare,
  IconWorld,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { saveInstituteSettingsAction } from "@/app/admin/iconfig/actions"
import { instituteTypeOptions, mediumOptions, type InstituteSettings } from "@/lib/institute-settings"

type InstituteSettingsFormProps = {
  settings: InstituteSettings
}

type EditableTab = "primary" | "contact" | "social"

export function InstituteSettingsForm({ settings }: InstituteSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<EditableTab>("primary")
  const [editingTab, setEditingTab] = useState<EditableTab | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const isTabEditing = (tab: EditableTab) => editingTab === tab
  const isReadOnlyMode = (tab: EditableTab) => !isTabEditing(tab) || isSaving

  const handleTabChange = (value: string) => {
    if (value === "primary" || value === "contact" || value === "social") {
      setActiveTab(value)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingTab) return

    const formData = new FormData(event.currentTarget)
    setIsSaving(true)

    try {
      const result = await saveInstituteSettingsAction(formData)

      if (result.status === "success") {
        toast.success(result.message)
        setEditingTab(null)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="w-full max-w-full overflow-x-hidden rounded-lg border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-slate-50/70 dark:bg-slate-900/40 px-5 py-4">
        <div>
          <h1 className="text-base font-bold text-foreground">Institute Settings</h1>
          <p className="text-xs text-muted-foreground">Update primary information, contact details, and social accounts.</p>
        </div>
        {editingTab ? (
          <Button type="button" variant="outline" size="sm" onClick={() => setEditingTab(null)}>
            Cancel Editing
          </Button>
        ) : (
          <Button type="button" variant="primary" size="sm" onClick={() => setEditingTab(activeTab)}>
            Edit Settings
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-full space-y-5 overflow-x-hidden p-4 sm:p-5">
        <input type="hidden" name="editingTab" value={editingTab ?? activeTab} />
        <Tabs value={activeTab} onValueChange={handleTabChange} className="!flex !w-full !max-w-full !flex-col gap-5 overflow-x-hidden">
          <TabsList className="!inline-flex !h-auto !w-full sm:!w-auto items-center justify-start gap-2 bg-transparent p-0 border-0 shadow-none overflow-x-auto">
            <TabsTrigger
              value="primary"
              disabled={Boolean(editingTab && editingTab !== "primary")}
              className="!h-9 gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground data-active:shadow-xs cursor-pointer"
            >
              <IconInfoCircle className="size-3.5 text-inherit" />
              <span>Primary Information</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              disabled={Boolean(editingTab && editingTab !== "contact")}
              className="!h-9 gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground data-active:shadow-xs cursor-pointer"
            >
              <IconPhone className="size-3.5 text-inherit" />
              <span>Contact Information</span>
            </TabsTrigger>
            <TabsTrigger
              value="social"
              disabled={Boolean(editingTab && editingTab !== "social")}
              className="!h-9 gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground data-active:shadow-xs cursor-pointer"
            >
              <IconShare className="size-3.5 text-inherit" />
              <span>Social Network</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="primary" className="w-full max-w-full overflow-x-hidden pt-2">
            <Card className="w-full max-w-full gap-0 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
              <CardHeader className="border-b border-border bg-slate-50/70 dark:bg-slate-900/40 p-4">
                <CardTitle className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="rounded bg-primary/10 p-1 text-primary"><IconInfoCircle className="size-4" /></span>
                  Primary Information
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Basic institute details, identifiers, and branding assets.</CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
                  <Field label="Institute Name" required>
                    <Input name="instituteName" defaultValue={settings.primary.instituteName} placeholder="Institute name" readOnly={isReadOnlyMode("primary")} required />
                  </Field>
                  <Field label="Institute Name (Bangla)">
                    <Input name="instituteNameBn" defaultValue={settings.primary.instituteNameBn} placeholder="প্রতিষ্ঠানের নাম" readOnly={isReadOnlyMode("primary")} />
                  </Field>

                  <Field label="Short Form">
                    <Input name="shortForm" defaultValue={settings.primary.shortForm} placeholder="e.g. AgradutEMS" readOnly={isReadOnlyMode("primary")} />
                  </Field>
                  <Field label="Motto">
                    <Input name="motto" defaultValue={settings.primary.motto} placeholder="Institute motto" readOnly={isReadOnlyMode("primary")} />
                  </Field>

                  <Field label="Medium" required>
                    <FormSelectField
                      name="medium"
                      defaultValue={settings.primary.medium}
                      placeholder="Select medium"
                      disabled={isReadOnlyMode("primary")}
                      options={mediumOptions.map((value) => ({ value, label: value }))}
                    />
                  </Field>
                  <Field label="Establish Year">
                    <Input name="establishYear" type="number" defaultValue={settings.primary.establishYear} placeholder="2005" readOnly={isReadOnlyMode("primary")} />
                  </Field>

                  <Field label="EIIN">
                    <Input name="eiin" defaultValue={settings.primary.eiin} placeholder="EIIN" readOnly={isReadOnlyMode("primary")} />
                  </Field>
                  <Field label="MPO Code">
                    <Input name="mpoCode" defaultValue={settings.primary.mpoCode} placeholder="MPO code" readOnly={isReadOnlyMode("primary")} />
                  </Field>

                  <Field label="Institute Code">
                    <Input name="instituteCode" defaultValue={settings.primary.instituteCode} placeholder="Institute code" readOnly={isReadOnlyMode("primary")} />
                  </Field>
                  <Field label="Institute Type">
                    <FormSelectField
                      name="instituteType"
                      defaultValue={settings.primary.instituteType ?? "School & College"}
                      placeholder="Select type"
                      disabled={isReadOnlyMode("primary")}
                      options={instituteTypeOptions.map((value) => ({ value, label: value }))}
                    />
                  </Field>

                  <Field label="Board">
                    <Input name="board" defaultValue={settings.primary.board} placeholder="Board" readOnly={isReadOnlyMode("primary")} />
                  </Field>
                  <Field label="Affiliation">
                    <Input name="affiliation" defaultValue={settings.primary.affiliation} placeholder="Affiliation" readOnly={isReadOnlyMode("primary")} />
                  </Field>

                  <Field
                    label="Logo"
                    action={
                      settings.primary.logo ? (
                        <a
                          href={settings.primary.logo}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View current logo"
                          className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          <IconEye className="size-3.5" />
                        </a>
                      ) : null
                    }
                  >
                    <input type="hidden" name="logo_current" value={settings.primary.logo ?? ""} />
                    <Input type="file" name="logo_file" accept="image/jpeg,image/png,image/webp" disabled={isReadOnlyMode("primary")} />
                    <p className="mt-1 text-xs text-muted-foreground">Recommended size: 512 x 512 px (square), max 5MB.</p>
                  </Field>
                  <Field
                    label="Favicon"
                    action={
                      settings.primary.favicon ? (
                        <a
                          href={settings.primary.favicon}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View current favicon"
                          className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          <IconEye className="size-3.5" />
                        </a>
                      ) : null
                    }
                  >
                    <input type="hidden" name="favicon_current" value={settings.primary.favicon ?? ""} />
                    <Input type="file" name="favicon_file" accept="image/jpeg,image/png,image/webp" disabled={isReadOnlyMode("primary")} />
                    <p className="mt-1 text-xs text-muted-foreground">Recommended size: 64 x 64 px (or 32 x 32 px), max 5MB.</p>
                  </Field>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="w-full max-w-full overflow-x-hidden pt-2">
            <Card className="w-full max-w-full gap-0 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
              <CardHeader className="border-b border-border bg-slate-50/70 dark:bg-slate-900/40 p-4">
                <CardTitle className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="rounded bg-primary/10 p-1 text-primary"><IconPhone className="size-4" /></span>
                  Contact Information
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Phone, email, address, office schedule, and map information.</CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
                  <Field label="Telephone" icon={<IconDeviceLandlinePhone className="size-4 text-primary" />}>
                    <Input name="telephone" defaultValue={settings.contact.telephone} placeholder="Telephone" readOnly={isReadOnlyMode("contact")} />
                  </Field>
                  <Field label="Mobile" icon={<IconPhone className="size-4 text-primary" />}>
                    <Input name="mobile" defaultValue={settings.contact.mobile} placeholder="Mobile" readOnly={isReadOnlyMode("contact")} />
                  </Field>

                  <Field label="Fax">
                    <Input name="fax" defaultValue={settings.contact.fax} placeholder="Fax" readOnly={isReadOnlyMode("contact")} />
                  </Field>
                  <Field label="Office Hours">
                    <Input name="officeHours" defaultValue={settings.contact.officeHours} placeholder="Office hours" readOnly={isReadOnlyMode("contact")} />
                  </Field>

                  <Field label="Website" icon={<IconWorld className="size-4 text-primary" />}>
                    <Input name="website" defaultValue={settings.contact.website} placeholder="https://..." readOnly={isReadOnlyMode("contact")} />
                  </Field>
                  <Field label="Email" icon={<IconMail className="size-4 text-primary" />}>
                    <Input name="email" defaultValue={settings.contact.email} placeholder="Email" readOnly={isReadOnlyMode("contact")} />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Address" icon={<IconMapPin className="size-4 text-primary" />}>
                      <Textarea name="address" defaultValue={settings.contact.address} rows={3} placeholder="Address" readOnly={isReadOnlyMode("contact")} />
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Google Map Embed Link">
                      <Input
                        name="googleMapEmbed"
                        type="url"
                        defaultValue={settings.contact.googleMapEmbed}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        readOnly={isReadOnlyMode("contact")}
                      />
                    </Field>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="w-full max-w-full overflow-x-hidden pt-2">
            <Card className="w-full max-w-full gap-0 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
              <CardHeader className="border-b border-border bg-slate-50/70 dark:bg-slate-900/40 p-4">
                <CardTitle className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="rounded bg-primary/10 p-1 text-primary"><IconShare className="size-4" /></span>
                  Social Network
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Official social handles and public messaging links.</CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
                  <Field label="Facebook" icon={<IconBrandFacebook className="size-4 text-primary" />}>
                    <Input name="facebook" defaultValue={settings.social.facebook} placeholder="https://facebook.com" readOnly={isReadOnlyMode("social")} />
                  </Field>
                  <Field label="Twitter/X" icon={<IconBrandTwitter className="size-4 text-primary" />}>
                    <Input name="twitter" defaultValue={settings.social.twitter} placeholder="https://twitter.com" readOnly={isReadOnlyMode("social")} />
                  </Field>

                  <Field label="LinkedIn" icon={<IconBrandLinkedin className="size-4 text-primary" />}>
                    <Input name="linkedin" defaultValue={settings.social.linkedin} placeholder="https://linkedin.com" readOnly={isReadOnlyMode("social")} />
                  </Field>
                  <Field label="Instagram" icon={<IconBrandInstagram className="size-4 text-primary" />}>
                    <Input name="instagram" defaultValue={settings.social.instagram} placeholder="https://instagram.com" readOnly={isReadOnlyMode("social")} />
                  </Field>

                  <Field label="YouTube" icon={<IconBrandYoutube className="size-4 text-primary" />}>
                    <Input name="youtube" defaultValue={settings.social.youtube} placeholder="https://youtube.com" readOnly={isReadOnlyMode("social")} />
                  </Field>
                  <Field label="WhatsApp" icon={<IconBrandWhatsapp className="size-4 text-primary" />}>
                    <Input name="whatsapp" defaultValue={settings.social.whatsapp} placeholder="+880-1XXXXXXXXX" readOnly={isReadOnlyMode("social")} />
                  </Field>

                  <Field label="TikTok" icon={<IconBrandTiktok className="size-4 text-primary" />}>
                    <Input name="tiktok" defaultValue={settings.social.tiktok} placeholder="https://tiktok.com" readOnly={isReadOnlyMode("social")} />
                  </Field>
                  <Field label="Telegram" icon={<IconBrandTelegram className="size-4 text-primary" />}>
                    <Input name="telegram" defaultValue={settings.social.telegram} placeholder="https://telegram.me" readOnly={isReadOnlyMode("social")} />
                  </Field>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          {editingTab ? (
            <>
              <Button type="button" variant="outline" onClick={() => setEditingTab(null)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </>
          ) : (
            <Button type="button" variant="primary" onClick={() => setEditingTab(activeTab)}>
              Edit Settings
            </Button>
          )}
        </div>
      </form>
    </section>
  )
}

function FormSelectField({
  name,
  defaultValue,
  placeholder,
  disabled,
  options,
}: {
  name: string
  defaultValue: string
  placeholder: string
  disabled?: boolean
  options: Array<{ value: string; label: string }>
}) {
  const [value, setValue] = useState(defaultValue)

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue} disabled={disabled}>
        <SelectTrigger className="h-9 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

function Field({
  label,
  children,
  required,
  icon,
  action,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <label className="block min-w-0 space-y-1.5 text-xs text-foreground">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90">
          {icon}
          {label}
          {required ? <span className="text-destructive">*</span> : null}
        </span>
        {action}
      </div>
      {children}
    </label>
  )
}
