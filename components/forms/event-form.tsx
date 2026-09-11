'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldGroup } from '@/components/ui/field'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { EventRecord } from '@/lib/db'
import {
  FileText,
  Calendar as CalendarIcon,
  ChevronDownIcon,
  MapPin,
  Users,
  Settings,
  Image as ImageIcon,
  Clock,
  Video,
  Ticket,
  User,
  Share2,
  Lock,
  Mail,
  Phone,
  Bookmark,
  Info,
  CheckSquare,
  Sparkles,
  Bell,
  Eye,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react'

interface EventFormProps {
  initialData?: Partial<EventRecord>
  onSubmit: (formData: FormData) => Promise<void>
  isLoading?: boolean
  submitButtonText?: string
  showDraftButton?: boolean
}

const EVENT_CATEGORIES = [
  { value: 'seminar', label: 'Seminar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'cultural-program', label: 'Cultural Program' },
  { value: 'sports', label: 'Sports & Games' },
  { value: 'examination', label: 'Examination' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'training', label: 'Training' },
]

const EVENT_STATUSES = ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled']
const AUDIENCE_TYPES = ['everyone', 'students', 'teachers', 'staff', 'specific-class']
const MEETING_PLATFORMS = ['zoom', 'google-meet', 'teams', 'custom']
const PAYMENT_METHODS = ['cash', 'online', 'check', 'bank-transfer']
const REMINDER_SCHEDULES = ['1-day-before', '3-hours-before', '30-minutes-before']
const TICKET_TYPES = [
  { value: 'free', label: 'Free Ticket' },
  { value: 'paid', label: 'Paid Admission' },
  { value: 'invite-only', label: 'Invite Only' },
]

type NamedListItem = string | { name?: string | null }

function formatNamedList(value: unknown): string {
  if (!Array.isArray(value)) return ''

  return value
    .map((item: NamedListItem) => {
      if (typeof item === 'string') return item
      return item.name ?? ''
    })
    .filter(Boolean)
    .join('\n')
}

function parseLocalDate(dateStr: string | null | undefined): Date | undefined {
  if (!dateStr) return undefined
  const [year, month, day] = dateStr.split('-').map(Number)
  if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined
  return new Date(year, month - 1, day)
}

const handleDateInputChange = (
  value: string,
  setDate: (d: Date | undefined) => void,
  setDateText: (t: string) => void
) => {
  setDateText(value)

  // Parse dd/mm/yyyy format
  const parts = value.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)

    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year >= 1000 && year <= 9999) {
      const date = new Date(year, month - 1, day)
      // Check if it's a valid calendar date
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        setDate(date)
        return
      }
    }
  }
  setDate(undefined)
}

export function EventForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Create Event',
  showDraftButton = true,
}: EventFormProps) {
  // Wizard navigation steps
  const [activeTab, setActiveTab] = useState('basic')

  // Date states
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.start_date ? parseLocalDate(initialData.start_date) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.end_date ? parseLocalDate(initialData.end_date) : undefined
  )
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | undefined>(
    initialData?.registration_deadline ? parseLocalDate(initialData.registration_deadline) : undefined
  )

  // Date text input states
  const [startDateText, setStartDateText] = useState(() => {
    if (!initialData?.start_date) return ''
    const parsed = parseLocalDate(initialData.start_date)
    return parsed ? format(parsed, 'dd/MM/yyyy') : ''
  })
  const [endDateText, setEndDateText] = useState(() => {
    if (!initialData?.end_date) return ''
    const parsed = parseLocalDate(initialData.end_date)
    return parsed ? format(parsed, 'dd/MM/yyyy') : ''
  })
  const [registrationDeadlineText, setRegistrationDeadlineText] = useState(() => {
    if (!initialData?.registration_deadline) return ''
    const parsed = parseLocalDate(initialData.registration_deadline)
    return parsed ? format(parsed, 'dd/MM/yyyy') : ''
  })

  // Popover open states
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [deadlineOpen, setDeadlineOpen] = useState(false)

  // Select states
  const [category, setCategory] = useState(initialData?.category ?? 'seminar')
  const [eventType, setEventType] = useState(initialData?.event_type ?? 'offline')
  const [status, setStatus] = useState(initialData?.status ?? 'draft')
  const [meetingPlatform, setMeetingPlatform] = useState(initialData?.meeting_platform ?? 'zoom')
  const [ticketType, setTicketType] = useState(initialData?.ticket_type ?? 'free')
  const [paymentMethod, setPaymentMethod] = useState(initialData?.payment_method ?? 'cash')
  const [audienceType, setAudienceType] = useState(initialData?.audience_type ?? 'everyone')
  const [reminderSchedule, setReminderSchedule] = useState(initialData?.reminder_schedule ?? '1-day-before')

  // Switch states
  const [allDay, setAllDay] = useState(initialData?.all_day ?? false)
  const [registrationEnabled, setRegistrationEnabled] = useState(initialData?.registration_enabled ?? false)
  const [approvalRequired, setApprovalRequired] = useState(initialData?.approval_required ?? false)
  const [passwordProtected, setPasswordProtected] = useState(initialData?.password_protected ?? false)
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true)
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false)
  const [homepageHighlight, setHomepageHighlight] = useState(initialData?.homepage_highlight ?? false)
  const [shareButtonsEnabled, setShareButtonsEnabled] = useState(initialData?.share_buttons_enabled ?? true)

  const [emailReminder, setEmailReminder] = useState(initialData?.email_reminder_enabled ?? false)
  const [smsReminder, setSmsReminder] = useState(initialData?.sms_reminder_enabled ?? false)
  const [certificateAvailable, setCertificateAvailable] = useState(initialData?.certificate_available ?? false)
  const [attendanceTracking, setAttendanceTracking] = useState(initialData?.attendance_tracking ?? false)
  const [feedbackForm, setFeedbackForm] = useState(initialData?.feedback_form_enabled ?? false)
  const [qrCheckin, setQrCheckin] = useState(initialData?.qr_checkin_enabled ?? false)
  const [ticketDownload, setTicketDownload] = useState(initialData?.ticket_download_enabled ?? false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-none space-y-6 event-form-container">
      {/* Hidden inputs to capture custom states for form serialization */}
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="event_type" value={eventType} />
      <input type="hidden" name="ticket_type" value={ticketType} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="meeting_platform" value={meetingPlatform} />
      <input type="hidden" name="payment_method" value={paymentMethod} />
      <input type="hidden" name="audience_type" value={audienceType} />
      <input type="hidden" name="start_date" value={startDate ? format(startDate, 'yyyy-MM-dd') : ''} />
      <input type="hidden" name="end_date" value={endDate ? format(endDate, 'yyyy-MM-dd') : ''} />
      <input type="hidden" name="registration_deadline" value={registrationDeadline ? format(registrationDeadline, 'yyyy-MM-dd') : ''} />
      <input type="hidden" name="reminder_schedule" value={reminderSchedule} />

      {/* Hidden native checkboxes for form actions */}
      <input type="checkbox" name="all_day" checked={allDay} readOnly className="hidden" />
      <input type="checkbox" name="registration_enabled" checked={registrationEnabled} readOnly className="hidden" />
      <input type="checkbox" name="approval_required" checked={approvalRequired} readOnly className="hidden" />
      <input type="checkbox" name="password_protected" checked={passwordProtected} readOnly className="hidden" />
      <input type="checkbox" name="is_public" checked={isPublic} readOnly className="hidden" />
      <input type="checkbox" name="is_featured" checked={isFeatured} readOnly className="hidden" />
      <input type="checkbox" name="homepage_highlight" checked={homepageHighlight} readOnly className="hidden" />
      <input type="checkbox" name="share_buttons_enabled" checked={shareButtonsEnabled} readOnly className="hidden" />
      
      <input type="checkbox" name="email_reminder_enabled" checked={emailReminder} readOnly className="hidden" />
      <input type="checkbox" name="sms_reminder_enabled" checked={smsReminder} readOnly className="hidden" />
      <input type="checkbox" name="certificate_available" checked={certificateAvailable} readOnly className="hidden" />
      <input type="checkbox" name="attendance_tracking" checked={attendanceTracking} readOnly className="hidden" />
      <input type="checkbox" name="feedback_form_enabled" checked={feedbackForm} readOnly className="hidden" />
      <input type="checkbox" name="qr_checkin_enabled" checked={qrCheckin} readOnly className="hidden" />
      <input type="checkbox" name="ticket_download_enabled" checked={ticketDownload} readOnly className="hidden" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-none">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-100 p-1 rounded-xl h-auto! group-data-horizontal/tabs:h-auto! gap-1 border border-slate-200/50">
          <TabsTrigger 
            value="basic" 
            className="h-11! py-0 rounded-lg data-active:bg-white data-active:text-primary data-active:shadow-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all text-slate-600 hover:text-slate-900"
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger 
            value="schedule-location" 
            className="h-11! py-0 rounded-lg data-active:bg-white data-active:text-primary data-active:shadow-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all text-slate-600 hover:text-slate-900"
          >
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span>Schedule & Venue</span>
          </TabsTrigger>
          <TabsTrigger 
            value="registration-audience" 
            className="h-11! py-0 rounded-lg data-active:bg-white data-active:text-primary data-active:shadow-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all text-slate-600 hover:text-slate-900"
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>Registration & Host</span>
          </TabsTrigger>
          <TabsTrigger 
            value="advanced-seo" 
            className="h-11! py-0 rounded-lg data-active:bg-white data-active:text-primary data-active:shadow-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all text-slate-600 hover:text-slate-900"
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Advanced & SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: BASIC INFORMATION ─── */}
        <TabsContent value="basic" className="mt-6 focus-visible:outline-none">
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <FileText className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Basic Event Details</h3>
                  <p className="text-xs text-slate-500">Provide the primary identifying information and descriptions of the event.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Event Title <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="e.g. Annual Science Fair 2026" 
                    required 
                    defaultValue={initialData?.title ?? ''} 
                    className="h-11 rounded-lg border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-semibold text-slate-700">Event Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    placeholder="e.g. annual-science-fair-2026" 
                    defaultValue={initialData?.slug ?? ''} 
                    className="h-11 rounded-lg font-mono text-xs border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11 rounded-lg border-slate-200">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Event Mode / Type</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="h-11 rounded-lg border-slate-200">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Physical / In-Person</SelectItem>
                      <SelectItem value="online">Virtual / Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Display Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-11 rounded-lg border-slate-200">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_STATUSES.map(s => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image_url" className="text-sm font-semibold text-slate-700">Featured Image URL</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <ImageIcon className="h-4 w-4" />
                    </span>
                    <Input 
                      id="image_url" 
                      name="image_url" 
                      type="url" 
                      placeholder="https://media.wasiamadrasah.edu.bd/events/banner.jpg" 
                      defaultValue={initialData?.image_url ?? ''} 
                      className="h-11 rounded-lg pl-10 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="short_description" className="text-sm font-semibold text-slate-700">Short Summary</Label>
                  <Textarea 
                    id="short_description" 
                    name="short_description" 
                    placeholder="Brief description displayed in lists & previews..." 
                    defaultValue={initialData?.short_description ?? ''} 
                    rows={2} 
                    className="rounded-lg border-slate-200"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Full Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Detailed event breakdown, schedule overview, requirements..." 
                    defaultValue={initialData?.description ?? ''} 
                    rows={5} 
                    className="rounded-lg border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 2: SCHEDULE & VENUE ─── */}
        <TabsContent value="schedule-location" className="mt-6 focus-visible:outline-none space-y-6">
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Clock className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Date & Time Settings</h3>
                  <p className="text-xs text-slate-500">Configure scheduling parameters, timezone, and deadlines.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FieldGroup className="flex-row gap-4">
                  <Field className="flex-1">
                    <Label className="text-sm font-semibold text-slate-700">Start Date <span className="text-red-500">*</span></Label>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="dd/mm/yyyy"
                        value={startDateText}
                        onChange={(e) => handleDateInputChange(e.target.value, setStartDate, setStartDateText)}
                        required
                        className="h-11 pr-10 border-slate-200 bg-white w-full"
                      />
                      <Popover open={startOpen} onOpenChange={setStartOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                          >
                            <CalendarIcon className="h-4.5 w-4.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            captionLayout="dropdown"
                            defaultMonth={startDate || new Date()}
                            onSelect={(date) => {
                              setStartDate(date)
                              setStartDateText(date ? format(date, "dd/MM/yyyy") : "")
                              setStartOpen(false)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </Field>
                  <Field className="flex-1">
                    <Label htmlFor="start_time" className="text-sm font-semibold text-slate-700">Start Time</Label>
                    <Input
                      type="time"
                      id="start_time"
                      name="start_time"
                      defaultValue={initialData?.start_time ?? ''}
                      className="h-11 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup className="flex-row gap-4">
                  <Field className="flex-1">
                    <Label className="text-sm font-semibold text-slate-700">End Date <span className="text-red-500">*</span></Label>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="dd/mm/yyyy"
                        value={endDateText}
                        onChange={(e) => handleDateInputChange(e.target.value, setEndDate, setEndDateText)}
                        required
                        className="h-11 pr-10 border-slate-200 bg-white w-full"
                      />
                      <Popover open={endOpen} onOpenChange={setEndOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                          >
                            <CalendarIcon className="h-4.5 w-4.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            captionLayout="dropdown"
                            defaultMonth={endDate || new Date()}
                            onSelect={(date) => {
                              setEndDate(date)
                              setEndDateText(date ? format(date, "dd/MM/yyyy") : "")
                              setEndOpen(false)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </Field>
                  <Field className="flex-1">
                    <Label htmlFor="end_time" className="text-sm font-semibold text-slate-700">End Time</Label>
                    <Input
                      type="time"
                      id="end_time"
                      name="end_time"
                      defaultValue={initialData?.end_time ?? ''}
                      className="h-11 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </Field>
                </FieldGroup>

                <Field>
                  <Label htmlFor="timezone" className="text-sm font-semibold text-slate-700">Timezone</Label>
                  <Input id="timezone" name="timezone" placeholder="e.g. BDT (UTC+6)" defaultValue={initialData?.timezone ?? 'BDT'} className="h-11 rounded-lg border-slate-200" />
                </Field>

                <Field>
                  <Label className="text-sm font-semibold text-slate-700">Registration Deadline</Label>
                  <div className="relative flex items-center">
                    <Input
                      placeholder="dd/mm/yyyy"
                      value={registrationDeadlineText}
                      onChange={(e) => handleDateInputChange(e.target.value, setRegistrationDeadline, setRegistrationDeadlineText)}
                      className="h-11 pr-10 border-slate-200 bg-white w-full"
                    />
                    <Popover open={deadlineOpen} onOpenChange={setDeadlineOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                        >
                          <CalendarIcon className="h-4.5 w-4.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={registrationDeadline}
                          captionLayout="dropdown"
                          defaultMonth={registrationDeadline || new Date()}
                          onSelect={(date) => {
                            setRegistrationDeadline(date)
                            setRegistrationDeadlineText(date ? format(date, "dd/MM/yyyy") : "")
                            setDeadlineOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </Field>
              </div>

              {/* All Day Toggle Card */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                <div>
                  <Label htmlFor="all_day" className="font-bold text-sm text-slate-800 cursor-pointer">All Day Event</Label>
                  <p className="text-xs text-slate-500 mt-0.5">Check this if the event spans the entire calendar date without specific hours.</p>
                </div>
                <Switch id="all_day" checked={allDay} onCheckedChange={setAllDay} />
              </div>
            </CardContent>
          </Card>

          {/* Physical Location Card - shown if eventType is offline or hybrid */}
          {(eventType === 'offline' || eventType === 'hybrid') && (
            <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden transition-all duration-300">
              <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Physical Venue & Address</h3>
                    <p className="text-xs text-slate-500">Provide directions, building descriptions, and location map link.</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="venue_name" className="text-sm font-semibold text-slate-700">Venue Name</Label>
                    <Input id="venue_name" name="venue_name" placeholder="e.g. Main Auditorium" defaultValue={initialData?.venue_name ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room_number" className="text-sm font-semibold text-slate-700">Room / Hall Number</Label>
                    <Input id="room_number" name="room_number" placeholder="e.g. Room 402, 3rd Floor" defaultValue={initialData?.room_number ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-slate-700">Street Address</Label>
                    <Textarea id="address" name="address" placeholder="e.g.mirpur-2, Dhaka" defaultValue={initialData?.address ?? ''} rows={2} className="rounded-lg p-3 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-semibold text-slate-700">City</Label>
                    <Input id="city" name="city" placeholder="e.g. Dhaka" defaultValue={initialData?.city ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district_state" className="text-sm font-semibold text-slate-700">District / State</Label>
                    <Input id="district_state" name="district_state" placeholder="e.g. Dhaka Division" defaultValue={initialData?.district_state ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="google_map_link" className="text-sm font-semibold text-slate-700">Google Maps Embed/Search Link</Label>
                    <Input id="google_map_link" name="google_map_link" type="url" placeholder="https://maps.google.com/?q=..." defaultValue={initialData?.google_map_link ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Online Event Card - shown if eventType is online or hybrid */}
          {(eventType === 'online' || eventType === 'hybrid') && (
            <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden transition-all duration-300">
              <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <Video className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Virtual / Online Details</h3>
                    <p className="text-xs text-slate-500">Provide connection endpoints, platform types, and passcodes.</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Meeting Platform</Label>
                    <Select value={meetingPlatform} onValueChange={setMeetingPlatform}>
                      <SelectTrigger className="h-11 rounded-lg border-slate-200">
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEETING_PLATFORMS.map(p => (
                          <SelectItem key={p} value={p}>
                            {p === 'teams' ? 'Microsoft Teams' : p.charAt(0).toUpperCase() + p.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting_id" className="text-sm font-semibold text-slate-700">Meeting ID / Room Code</Label>
                    <Input id="meeting_id" name="meeting_id" placeholder="e.g. 845 2931 9932" defaultValue={initialData?.meeting_id ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="meeting_url" className="text-sm font-semibold text-slate-700">Meeting Join URL</Label>
                    <Input id="meeting_url" name="meeting_url" type="url" placeholder="https://zoom.us/j/..." defaultValue={initialData?.meeting_url ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting_passcode" className="text-sm font-semibold text-slate-700">Passcode</Label>
                    <Input id="meeting_passcode" name="meeting_passcode" placeholder="e.g. 123456" defaultValue={initialData?.meeting_passcode ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─── TAB 3: REGISTRATION, AUDIENCE & HOST ─── */}
        <TabsContent value="registration-audience" className="mt-6 focus-visible:outline-none space-y-6">
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Ticket className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Registration & Ticketing</h3>
                  <p className="text-xs text-slate-500">Configure participant capacities, ticket constraints, fees, and approval options.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Registration Toggle Card */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                <div>
                  <Label htmlFor="registration_enabled" className="font-bold text-sm text-slate-800 cursor-pointer">Enable Online Registration</Label>
                  <p className="text-xs text-slate-500 mt-0.5">Let users register to attend this event.</p>
                </div>
                <Switch id="registration_enabled" checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
              </div>

              {registrationEnabled && (
                <div className="grid gap-6 md:grid-cols-2 pt-2 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="max_participants" className="text-sm font-semibold text-slate-700">Max Participant Capacity</Label>
                    <Input id="max_participants" name="max_participants" type="number" placeholder="e.g. 150" defaultValue={initialData?.max_participants ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Ticket Type</Label>
                    <Select value={ticketType} onValueChange={setTicketType}>
                      <SelectTrigger className="h-11 rounded-lg border-slate-200">
                        <SelectValue placeholder="Select Ticket Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {ticketType === 'paid' && (
                    <>
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                        <Label htmlFor="registration_fee" className="text-sm font-semibold text-slate-700">Ticket Price / Registration Fee</Label>
                        <Input id="registration_fee" name="registration_fee" type="number" step="0.01" placeholder="500.00" defaultValue={initialData?.registration_fee ?? ''} className="h-11 rounded-lg border-slate-200" />
                      </div>

                      <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                        <Label className="text-sm font-semibold text-slate-700">Allowed Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger className="h-11 rounded-lg border-slate-200">
                            <SelectValue placeholder="Select Payment Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_METHODS.map(m => (
                              <SelectItem key={m} value={m}>
                                {m.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Manual Approval Toggle Card */}
                  <div className="md:col-span-2 mt-2 flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <Label htmlFor="approval_required" className="font-bold text-sm text-slate-800 cursor-pointer">Admin Approval Required</Label>
                      <p className="text-xs text-slate-500 mt-0.5">Registrations remain pending until manually approved.</p>
                    </div>
                    <Switch id="approval_required" checked={approvalRequired} onCheckedChange={setApprovalRequired} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Audience Card */}
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Users className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Target Audience</h3>
                  <p className="text-xs text-slate-500">Define which scopes, departments, or classes this event is applicable to.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Audience Scope</Label>
                  <Select value={audienceType} onValueChange={setAudienceType}>
                    <SelectTrigger className="h-11 rounded-lg border-slate-200">
                      <SelectValue placeholder="Select Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCE_TYPES.map(t => (
                        <SelectItem key={t} value={t}>
                          {t.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicable_class" className="text-sm font-semibold text-slate-700">Target Class</Label>
                  <Input id="applicable_class" name="applicable_class" placeholder="e.g. Class 9, Class 10" defaultValue={initialData?.applicable_class ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold text-slate-700">Target Department</Label>
                  <Input id="department" name="department" placeholder="e.g. Science, Commerce" defaultValue={initialData?.department ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session_batch" className="text-sm font-semibold text-slate-700">Academic Session / Batch</Label>
                  <Input id="session_batch" name="session_batch" placeholder="e.g. 2025-2026" defaultValue={initialData?.session_batch ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizer Details Card */}
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <User className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Organizer & Host Details</h3>
                  <p className="text-xs text-slate-500">Provide names and contact numbers for communication channels.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="organizer_name" className="text-sm font-semibold text-slate-700">Primary Organizer / Body</Label>
                  <Input id="organizer_name" name="organizer_name" placeholder="e.g. Academic Committee" defaultValue={initialData?.organizer_name ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer_email" className="text-sm font-semibold text-slate-700">Organizer Email Address</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input id="organizer_email" name="organizer_email" type="email" placeholder="e.g. admin@school.edu.bd" defaultValue={initialData?.organizer_email ?? ''} className="h-11 rounded-lg pl-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer_phone" className="text-sm font-semibold text-slate-700">Organizer Contact Number</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input id="organizer_phone" name="organizer_phone" type="tel" placeholder="e.g. +8801700000000" defaultValue={initialData?.organizer_phone ?? ''} className="h-11 rounded-lg pl-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="co_organizer" className="text-sm font-semibold text-slate-700">Co-organizer</Label>
                  <Input id="co_organizer" name="co_organizer" placeholder="e.g. Science Club" defaultValue={initialData?.co_organizer ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hosted_by" className="text-sm font-semibold text-slate-700">Hosted By</Label>
                  <Input id="hosted_by" name="hosted_by" placeholder="e.g. Principal Office" defaultValue={initialData?.hosted_by ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 4: ADVANCED FEATURES & SEO ─── */}
        <TabsContent value="advanced-seo" className="mt-6 focus-visible:outline-none space-y-6">
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Share2 className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">SEO & Portal Visibility</h3>
                  <p className="text-xs text-slate-500">Configure public display settings, metadata flags, and protection passwords.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="meta_title" className="text-sm font-semibold text-slate-700">Meta Title</Label>
                  <Input id="meta_title" name="meta_title" maxLength={60} placeholder="Optimized browser tab title..." defaultValue={initialData?.meta_title ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="meta_description" className="text-sm font-semibold text-slate-700">Meta Description</Label>
                  <Textarea id="meta_description" name="meta_description" maxLength={160} placeholder="Search engine snippet text..." defaultValue={initialData?.meta_description ?? ''} rows={2} className="rounded-lg p-3 border-slate-200" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="keywords" className="text-sm font-semibold text-slate-700">Keywords (comma-separated)</Label>
                  <Textarea id="keywords" name="keywords" placeholder="e.g. school, science fair, project exhibition" defaultValue={initialData?.keywords ?? ''} rows={2} className="rounded-lg p-3 border-slate-200" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="social_share_image_url" className="text-sm font-semibold text-slate-700">Social Share Image</Label>
                  <Input id="social_share_image_url" name="social_share_image_url" type="url" placeholder="https://example.com/images/seo-banner.jpg" defaultValue={initialData?.social_share_image_url ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>
              </div>

              {/* Visibility and Protection Flags */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Display & Access Flags</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="is_public" className="text-xs font-semibold cursor-pointer">Public Event</Label>
                    <Switch id="is_public" checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="is_featured" className="text-xs font-semibold cursor-pointer">Featured Event</Label>
                    <Switch id="is_featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="homepage_highlight" className="text-xs font-semibold cursor-pointer">Highlight Homepage</Label>
                    <Switch id="homepage_highlight" checked={homepageHighlight} onCheckedChange={setHomepageHighlight} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="share_buttons_enabled" className="text-xs font-semibold cursor-pointer">Social Share Buttons</Label>
                    <Switch id="share_buttons_enabled" checked={shareButtonsEnabled} onCheckedChange={setShareButtonsEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="password_protected" className="text-xs font-semibold cursor-pointer">Password Protected</Label>
                    <Switch id="password_protected" checked={passwordProtected} onCheckedChange={setPasswordProtected} />
                  </div>
                </div>

                {passwordProtected && (
                  <div className="grid gap-4 md:grid-cols-2 mt-4 pt-4 border-t border-slate-100/50 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-2">
                      <Label htmlFor="event_password" className="text-sm font-semibold text-slate-700">Event Password</Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </span>
                        <Input id="event_password" name="event_password" type="text" placeholder="Enter protection password" defaultValue={initialData?.event_password ?? ''} className="h-11 rounded-lg pl-10 border-slate-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media & Branding Card */}
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <ImageIcon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Event Media & Assets</h3>
                  <p className="text-xs text-slate-500">Provide assets for brochures, logos, gallery carousels, and promos.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_image_url" className="text-sm font-semibold text-slate-700">Thumbnail Image URL</Label>
                  <Input id="thumbnail_image_url" name="thumbnail_image_url" type="url" placeholder="https://media.wasiamadrasah.edu.bd/events/thumb.jpg" defaultValue={initialData?.thumbnail_image_url ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_logo_url" className="text-sm font-semibold text-slate-700">Event Logo URL</Label>
                  <Input id="event_logo_url" name="event_logo_url" type="url" placeholder="https://media.wasiamadrasah.edu.bd/events/logo.png" defaultValue={initialData?.event_logo_url ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="gallery_images" className="text-sm font-semibold text-slate-700">Gallery Images (comma-separated URLs)</Label>
                  <Textarea id="gallery_images" name="gallery_images" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" defaultValue={initialData?.gallery_images?.join(', ') ?? ''} rows={2} className="rounded-lg p-3 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brochure_url" className="text-sm font-semibold text-slate-700">Event Brochure PDF URL</Label>
                  <Input id="brochure_url" name="brochure_url" type="url" placeholder="https://example.com/brochure.pdf" defaultValue={initialData?.brochure_url ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo_video_url" className="text-sm font-semibold text-slate-700">Promo Video URL</Label>
                  <Input id="promo_video_url" name="promo_video_url" type="url" placeholder="https://youtube.com/watch?v=..." defaultValue={initialData?.promo_video_url ?? ''} className="h-11 rounded-lg border-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Notifications & Checklist Card */}
          <Card className="border border-slate-200/80 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Bell className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Advanced Reminders & Features</h3>
                  <p className="text-xs text-slate-500">Configure email/SMS schedules, digital certs, checkins and additional notes.</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1.5"><Bell className="h-4 w-4 text-blue-600" /> Notification Reminders</h4>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="email_reminder" className="text-xs font-semibold cursor-pointer">Email Reminders</Label>
                    <Switch id="email_reminder" checked={emailReminder} onCheckedChange={setEmailReminder} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="sms_reminder" className="text-xs font-semibold cursor-pointer">SMS Reminders</Label>
                    <Switch id="sms_reminder" checked={smsReminder} onCheckedChange={setSmsReminder} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-500">Reminder Schedule</Label>
                    <Select value={reminderSchedule} onValueChange={setReminderSchedule}>
                      <SelectTrigger className="h-10 text-xs rounded-lg border-slate-200">
                        <SelectValue placeholder="Select Schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        {REMINDER_SCHEDULES.map(s => (
                          <SelectItem key={s} value={s}>
                            {s.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><CheckSquare className="h-4 w-4 text-blue-600" /> Features & Operations Checklist</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="certificate_available" className="text-xs font-semibold cursor-pointer">Certificate Available</Label>
                    <Switch id="certificate_available" checked={certificateAvailable} onCheckedChange={setCertificateAvailable} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="attendance_tracking" className="text-xs font-semibold cursor-pointer">Attendance Tracking</Label>
                    <Switch id="attendance_tracking" checked={attendanceTracking} onCheckedChange={setAttendanceTracking} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="feedback_form" className="text-xs font-semibold cursor-pointer">Feedback Form</Label>
                    <Switch id="feedback_form" checked={feedbackForm} onCheckedChange={setFeedbackForm} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="qr_checkin" className="text-xs font-semibold cursor-pointer">QR Check-in</Label>
                    <Switch id="qr_checkin" checked={qrCheckin} onCheckedChange={setQrCheckin} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <Label htmlFor="ticket_download" className="text-xs font-semibold cursor-pointer">Ticket Download</Label>
                    <Switch id="ticket_download" checked={ticketDownload} onCheckedChange={setTicketDownload} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Additional Information</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dress_code" className="text-sm font-semibold text-slate-700">Dress Code</Label>
                    <Input id="dress_code" name="dress_code" placeholder="e.g. Formal or Casual" defaultValue={initialData?.dress_code ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="required_materials" className="text-sm font-semibold text-slate-700">Required Materials</Label>
                    <Input id="required_materials" name="required_materials" placeholder="e.g. Laptops, ID cards" defaultValue={initialData?.required_materials ?? ''} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest_speakers" className="text-sm font-semibold text-slate-700">Guest Speakers (one per line)</Label>
                    <Textarea id="guest_speakers" name="guest_speakers" placeholder="Dr. John Doe&#10;Professor Jane Smith" defaultValue={formatNamedList(initialData?.guest_speakers)} rows={3} className="rounded-lg p-3 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsors" className="text-sm font-semibold text-slate-700">Sponsors (one per line)</Label>
                    <Textarea id="sponsors" name="sponsors" placeholder="TechCorp Ltd&#10;Alumni Fund" defaultValue={formatNamedList(initialData?.sponsors)} rows={3} className="rounded-lg p-3 border-slate-200" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Submission Action Bar */}
      <Card className="border border-slate-200/80 shadow-md bg-white rounded-2xl overflow-hidden mt-6">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Info className="h-4.5 w-4.5 text-blue-600" />
            <span>Confirm all settings are configured across all tabs before submission.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-7 font-bold rounded-xl shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
            >
              {isLoading ? 'Processing...' : submitButtonText}
            </Button>
            {showDraftButton && (
              <Button 
                type="button" 
                variant="outline" 
                disabled={isLoading} 
                onClick={(e) => {
                  const form = e.currentTarget.closest('form')
                  if (form) {
                    const statusField = form.querySelector('input[name="status"]') as HTMLInputElement
                    if (statusField) statusField.value = 'draft'
                    form.dispatchEvent(new Event('submit', { bubbles: true }))
                  }
                }}
                className="h-11 px-5 font-semibold rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Save as Draft
              </Button>
            )}
            <Button 
              type="reset" 
              variant="outline" 
              disabled={isLoading}
              className="h-11 px-5 font-semibold rounded-xl text-slate-500 border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
