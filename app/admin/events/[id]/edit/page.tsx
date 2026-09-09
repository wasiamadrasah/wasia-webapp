import Link from "next/link"
import { notFound } from "next/navigation"

import { updateEventAction } from "@/app/admin/actions"
import { getEventById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { EventFormClient } from "@/components/forms/event-form-client"

type EditEventPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground mt-2">
            Update event details
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/events">Back to Events</Link>
        </Button>
      </div>

      <EventFormClient
        eventId={event.id}
        initialData={event}
        onSubmit={updateEventAction}
        submitButtonText="Update Event"
        showDraftButton={false}
      />
    </div>
  )
}
