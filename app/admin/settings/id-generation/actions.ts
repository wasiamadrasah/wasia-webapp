"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { saveIDGenerationSettings } from "@/lib/id-generation-store"
import type { IDGenerationSettings } from "@/lib/id-generation"

async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }
}

export async function saveIDGenerationSettingsAction(settings: IDGenerationSettings) {
  await requireAdminSession()

  try {
    await saveIDGenerationSettings(settings)
    revalidatePath("/admin/settings/id-generation")
    revalidatePath("/admin/employees")
    revalidatePath("/admin/students")

    return { success: true, message: "ID generation settings saved successfully." }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save ID generation settings."
    return { success: false, message }
  }
}
