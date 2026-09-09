"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createSupabaseAdminClient } from "@/lib/db"
import { redirect } from "next/navigation"

export async function saveGoverningBodyMemberAction(
  memberId: string | undefined,
  data: {
    name: string
    designation: string
    category: string
    email: string
    phone: string
    image_url: string | null
  }
) {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }

  const supabase = createSupabaseAdminClient()

  try {
    if (memberId) {
      // Update existing member
      const { error } = await supabase
        .from("governing_body_members")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", memberId)

      if (error) {
        throw new Error(error.message)
      }
    } else {
      // Create new member
      const { error } = await supabase
        .from("governing_body_members")
        .insert([
          {
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

      if (error) {
        throw new Error(error.message)
      }
    }

    revalidatePath("/admin/pages/governing-body")
  } catch (error) {
    console.error("Error saving governing body member:", error)
    throw error
  }
}

export async function deleteMemberAction(memberId: string) {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }

  const supabase = createSupabaseAdminClient()

  try {
    const { error } = await supabase
      .from("governing_body_members")
      .delete()
      .eq("id", memberId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/pages/governing-body")
  } catch (error) {
    console.error("Error deleting governing body member:", error)
    throw error
  }
}
