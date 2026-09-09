'use client'

import { EventForm } from './event-form'
import { EventRecord } from '@/lib/db'

interface EventFormClientProps {
  eventId: string
  initialData?: Partial<EventRecord>
  onSubmit: (eventId: string, formData: FormData) => Promise<void>
  submitButtonText?: string
  showDraftButton?: boolean
}

export function EventFormClient({
  eventId,
  initialData,
  onSubmit,
  submitButtonText = 'Update Event',
  showDraftButton = false,
}: EventFormClientProps) {
  const handleSubmit = async (formData: FormData) => {
    await onSubmit(eventId, formData)
  }

  return (
    <EventForm
      initialData={initialData}
      onSubmit={handleSubmit}
      submitButtonText={submitButtonText}
      showDraftButton={showDraftButton}
    />
  )
}
