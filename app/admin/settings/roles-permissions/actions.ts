"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseAdminClient } from "@/lib/db"
import { getAuthSession } from "@/lib/auth"

export interface DBRole {
  id: string
  name: string
  slug: string
  description: string | null
  is_system: boolean
  permissions: string[]
  created_at: string
  updated_at: string
}

/**
 * Fetch all roles and their assigned permissions directly from the database.
 */
export async function getRolesWithPermissions(): Promise<{
  success: boolean
  data?: DBRole[]
  error?: string
}> {
  try {
    const supabase = createSupabaseAdminClient()

    // 1. Fetch all roles ordered by system roles first, then by name
    const { data: rolesData, error: rolesError } = await supabase
      .from("roles")
      .select("id, name, slug, description, is_system, created_at, updated_at")
      .order("is_system", { ascending: false })
      .order("name", { ascending: true })

    if (rolesError) {
      return { success: false, error: rolesError.message }
    }

    if (!rolesData || rolesData.length === 0) {
      return { success: true, data: [] }
    }

    // 2. Fetch all role permissions
    const { data: permsData, error: permsError } = await supabase
      .from("role_permissions")
      .select("role_id, permission_key")

    if (permsError) {
      return { success: false, error: permsError.message }
    }

    // 3. Map permissions to each role
    const permMap = new Map<string, string[]>()
    if (permsData) {
      permsData.forEach((p) => {
        const existing = permMap.get(p.role_id) || []
        existing.push(p.permission_key)
        permMap.set(p.role_id, existing)
      })
    }

    const merged: DBRole[] = rolesData.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      is_system: Boolean(r.is_system),
      permissions: permMap.get(r.id) || [],
      created_at: r.created_at,
      updated_at: r.updated_at,
    }))

    return { success: true, data: merged }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load roles from database."
    return { success: false, error: message }
  }
}

/**
 * Fetch a single role and its permissions by ID or slug.
 */
export async function getRoleById(
  idOrSlug: string
): Promise<{ success: boolean; data?: DBRole; error?: string }> {
  try {
    const supabase = createSupabaseAdminClient()

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)

    let query = supabase
      .from("roles")
      .select("id, name, slug, description, is_system, created_at, updated_at")

    if (isUUID) {
      query = query.eq("id", idOrSlug)
    } else {
      query = query.eq("slug", idOrSlug)
    }

    const { data: roleData, error: roleError } = await query.single()

    if (roleError || !roleData) {
      return { success: false, error: roleError?.message || "Role not found in database." }
    }

    const { data: permsData, error: permsError } = await supabase
      .from("role_permissions")
      .select("permission_key")
      .eq("role_id", roleData.id)

    if (permsError) {
      return { success: false, error: permsError.message }
    }

    const permissions = permsData ? permsData.map((p) => p.permission_key) : []

    return {
      success: true,
      data: {
        id: roleData.id,
        name: roleData.name,
        slug: roleData.slug,
        description: roleData.description,
        is_system: Boolean(roleData.is_system),
        permissions,
        created_at: roleData.created_at,
        updated_at: roleData.updated_at,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch role."
    return { success: false, error: message }
  }
}

/**
 * Create a new custom role directly in the database.
 */
export async function createRoleAction(
  name: string,
  description?: string
): Promise<{ success: boolean; data?: DBRole; error?: string }> {
  try {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { success: false, error: "Role name is required." }
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("roles")
      .insert([
        {
          name: trimmedName,
          slug: slug || `role-${Date.now()}`,
          description: description?.trim() || null,
          is_system: false,
        },
      ])
      .select("id, name, slug, description, is_system, created_at, updated_at")
      .single()

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "A role with this name already exists." }
      }
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/settings/roles-permissions")
    return {
      success: true,
      data: {
        ...data,
        is_system: false,
        permissions: [],
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create role."
    return { success: false, error: message }
  }
}

/**
 * Update an existing role in the database.
 */
export async function updateRoleAction(
  id: string,
  name: string,
  description?: string
): Promise<{ success: boolean; data?: DBRole; error?: string }> {
  try {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { success: false, error: "Role name is required." }
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("roles")
      .update({
        name: trimmedName,
        slug: slug || `role-${Date.now()}`,
        description: description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, name, slug, description, is_system, created_at, updated_at")
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/settings/roles-permissions")
    return {
      success: true,
      data: {
        ...data,
        is_system: Boolean(data.is_system),
        permissions: [],
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update role."
    return { success: false, error: message }
  }
}

/**
 * Delete a custom role from the database.
 */
export async function deleteRoleAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseAdminClient()

    // Check if system role
    const { data: role, error: checkError } = await supabase
      .from("roles")
      .select("is_system")
      .eq("id", id)
      .single()

    if (checkError) {
      return { success: false, error: checkError.message }
    }

    if (role?.is_system) {
      return { success: false, error: "System core roles cannot be deleted." }
    }

    const { error } = await supabase.from("roles").delete().eq("id", id)
    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/settings/roles-permissions")
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete role."
    return { success: false, error: message }
  }
}

/**
 * Update permission matrix for a specific role in the database.
 */
export async function saveRolePermissionsAction(
  roleId: string,
  permissions: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseAdminClient()

    // 1. Delete existing permissions for this role
    const { error: deleteError } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId)

    if (deleteError) {
      console.error("Error deleting old permissions:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // 2. Insert new permissions if any selected
    if (permissions.length > 0) {
      const records = permissions.map((key) => ({
        role_id: roleId,
        permission_key: key,
      }))

      const { error: insertError } = await supabase
        .from("role_permissions")
        .insert(records)

      if (insertError) {
        console.error("Error inserting permissions:", insertError)
        return { success: false, error: insertError.message }
      }
    }

    revalidatePath("/admin/settings/roles-permissions")
    revalidatePath(`/admin/settings/roles-permissions/${roleId}`)
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update permissions."
    console.error("saveRolePermissionsAction error:", message)
    return { success: false, error: message }
  }
}
