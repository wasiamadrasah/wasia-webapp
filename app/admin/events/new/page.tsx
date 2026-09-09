'use client'

import Link from "next/link"
import { createEventAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { EventForm } from "@/components/forms/event-form"

export default function NewEventPage() {
  return (
    <div className="w-full max-w-none space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground mt-2">
            Add a comprehensive school event with all details
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/events">Back to Events</Link>
        </Button>
      </div>

      <EventForm
        onSubmit={createEventAction}
        submitButtonText="Create Event"
        showDraftButton={true}
      />
    </div>
  )
}
