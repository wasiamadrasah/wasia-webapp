"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/db";
import { RATE_LIMITS, createUserRateLimitMiddleware } from "@/lib/rate-limit";

// ─── Helpers (mirrored from admin/actions.ts pattern) ────────────────────────

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }
  return session.user.id;
}

function checkAdminRateLimit(userId: string) {
  const rl = createUserRateLimitMiddleware(`admin:${userId}`, RATE_LIMITS.ADMIN_MUTATIONS);
  if (!rl.allowed) throw new Error("Rate limit exceeded. Please try again later.");
}

function isRedirectError(error: unknown) {
  return error instanceof Error && error.message.includes("NEXT_REDIRECT");
}

function resolveErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function toNullableString(value: FormDataEntryValue | null): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text : null;
}

function toNullableNumber(value: FormDataEntryValue | null): number | null {
  const text = toNullableString(value);
  if (!text) return null;
  const parsed = Number.parseInt(text, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toNullableBoolean(value: FormDataEntryValue | null): boolean | null {
  const text = toNullableString(value);
  if (text === "true" || text === "on") return true;
  if (text === "false") return false;
  return null;
}

function isDuplicateKeyError(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    error.code === "23505" ||
    (error.message ?? "").toLowerCase().includes("unique constraint") ||
    (error.message ?? "").toLowerCase().includes("duplicate key")
  );
}

const REVALIDATE_PATHS = ["/admin/academics"];

function revalidateAcademicPaths(...extra: string[]) {
  for (const p of [...REVALIDATE_PATHS, ...extra]) {
    revalidatePath(p);
  }
}

// ─── ACADEMIC SESSIONS ────────────────────────────────────────────────────────

export async function createSessionAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Session name is required.");

    const isActive = toNullableBoolean(formData.get("is_active")) ?? false;

    // Enforce single-active-session rule
    if (isActive) {
      await supabase.from("academic_sessions").update({ is_active: false }).eq("is_active", true);
    }

    const { error } = await supabase.from("academic_sessions").insert({
      name,
      start_date: toNullableString(formData.get("start_date")),
      end_date: toNullableString(formData.get("end_date")),
      is_active: isActive,
    });

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/sessions");
    redirect("/admin/academics/sessions?status=success&message=Session created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create session");
    redirect(`/admin/academics/sessions?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateSessionAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Session name is required.");

    const isActive = toNullableBoolean(formData.get("is_active")) ?? false;

    if (isActive) {
      await supabase
        .from("academic_sessions")
        .update({ is_active: false })
        .eq("is_active", true)
        .neq("id", id);
    }

    const { error } = await supabase
      .from("academic_sessions")
      .update({
        name,
        start_date: toNullableString(formData.get("start_date")),
        end_date: toNullableString(formData.get("end_date")),
        is_active: isActive,
      })
      .eq("id", id);

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/sessions");
    redirect("/admin/academics/sessions?status=success&message=Session updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update session");
    redirect(`/admin/academics/sessions/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleSessionActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();

    if (!currentlyActive) {
      // Deactivate all others first
      await supabase.from("academic_sessions").update({ is_active: false }).eq("is_active", true);
    }

    const { error } = await supabase
      .from("academic_sessions")
      .update({ is_active: !currentlyActive })
      .eq("id", id);

    if (error) throw error;
    revalidateAcademicPaths("/admin/academics/sessions");
  } catch (error) {
    console.error("toggleSessionActiveAction error:", error);
    throw error;
  }
}

export async function deleteSessionAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();

    // Check for dependent class configs
    const { count } = await supabase
      .from("academic_class_configs")
      .select("id", { count: "exact", head: true })
      .eq("session_id", id);

    if ((count ?? 0) > 0) {
      throw new Error(`Cannot delete: ${count} class configuration(s) reference this session.`);
    }

    const { error } = await supabase.from("academic_sessions").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/sessions");
    redirect("/admin/academics/sessions?status=success&message=Session deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete session");
    redirect(`/admin/academics/sessions?status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── ACADEMIC VERSIONS ────────────────────────────────────────────────────────

export async function createVersionAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    const code = toNullableString(formData.get("code"));
    if (!name) throw new Error("Version name is required.");
    if (!code) throw new Error("Version code is required.");

    const { error } = await supabase.from("academic_versions").insert({
      name,
      code: code.toUpperCase(),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error(`Version code "${code}" already exists.`);
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/versions");
    redirect("/admin/academics/versions?status=success&message=Version created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create version");
    redirect(`/admin/academics/versions?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateVersionAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    const code = toNullableString(formData.get("code"));
    if (!name) throw new Error("Version name is required.");
    if (!code) throw new Error("Version code is required.");

    const { error } = await supabase
      .from("academic_versions")
      .update({ name, code: code.toUpperCase(), is_active: toNullableBoolean(formData.get("is_active")) ?? true })
      .eq("id", id);

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error(`Version code "${code}" already exists.`);
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/versions");
    redirect("/admin/academics/versions?status=success&message=Version updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update version");
    redirect(`/admin/academics/versions/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleVersionActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("academic_versions").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/versions");
}

export async function deleteVersionAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const { count } = await supabase
      .from("academic_class_configs")
      .select("id", { count: "exact", head: true })
      .eq("version_id", id);

    if ((count ?? 0) > 0) throw new Error(`Cannot delete: ${count} class configuration(s) use this version.`);

    const { error } = await supabase.from("academic_versions").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/versions");
    redirect("/admin/academics/versions?status=success&message=Version deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete version");
    redirect(`/admin/academics/versions?status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── ACADEMIC SHIFTS ──────────────────────────────────────────────────────────

export async function createShiftAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Shift name is required.");

    const { error } = await supabase.from("academic_shifts").insert({
      name,
      start_time: toNullableString(formData.get("start_time")),
      end_time: toNullableString(formData.get("end_time")),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/shifts");
    redirect("/admin/academics/shifts?status=success&message=Shift created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create shift");
    redirect(`/admin/academics/shifts?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateShiftAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Shift name is required.");

    const { error } = await supabase
      .from("academic_shifts")
      .update({
        name,
        start_time: toNullableString(formData.get("start_time")),
        end_time: toNullableString(formData.get("end_time")),
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
      })
      .eq("id", id);

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/shifts");
    redirect("/admin/academics/shifts?status=success&message=Shift updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update shift");
    redirect(`/admin/academics/shifts/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleShiftActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("academic_shifts").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/shifts");
}

export async function deleteShiftAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const { count } = await supabase
      .from("academic_class_configs")
      .select("id", { count: "exact", head: true })
      .eq("shift_id", id);

    if ((count ?? 0) > 0) throw new Error(`Cannot delete: ${count} class configuration(s) use this shift.`);

    const { error } = await supabase.from("academic_shifts").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/shifts");
    redirect("/admin/academics/shifts?status=success&message=Shift deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete shift");
    redirect(`/admin/academics/shifts?status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── CLASSES ──────────────────────────────────────────────────────────────────

export async function createClassAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Class name is required.");

    const { error } = await supabase.from("classes").insert({
      name,
      numeric_value: toNullableNumber(formData.get("numeric_value")),
      display_order: toNullableNumber(formData.get("display_order")) ?? 0,
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/classes");
    redirect("/admin/academics/classes?status=success&message=Class created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create class");
    redirect(`/admin/academics/classes?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateClassAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Class name is required.");

    const { error } = await supabase
      .from("classes")
      .update({
        name,
        numeric_value: toNullableNumber(formData.get("numeric_value")),
        display_order: toNullableNumber(formData.get("display_order")) ?? 0,
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
      })
      .eq("id", id);

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/classes");
    redirect("/admin/academics/classes?status=success&message=Class updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update class");
    redirect(`/admin/academics/classes/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleClassActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("classes").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/classes");
}

export async function deleteClassAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const { count } = await supabase
      .from("academic_class_configs")
      .select("id", { count: "exact", head: true })
      .eq("class_id", id);

    if ((count ?? 0) > 0) throw new Error(`Cannot delete: ${count} class configuration(s) use this class.`);

    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/classes");
    redirect("/admin/academics/classes?status=success&message=Class deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete class");
    redirect(`/admin/academics/classes?status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

export async function createSectionAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Section name is required.");

    const { error } = await supabase.from("sections").insert({
      name,
      capacity: toNullableNumber(formData.get("capacity")),
      room_no: toNullableString(formData.get("room_no")),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/sections");
    redirect("/admin/academics/sections?status=success&message=Section created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create section");
    redirect(`/admin/academics/sections?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateSectionAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Section name is required.");

    const { error } = await supabase
      .from("sections")
      .update({
        name,
        capacity: toNullableNumber(formData.get("capacity")),
        room_no: toNullableString(formData.get("room_no")),
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
      })
      .eq("id", id);

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/sections");
    redirect("/admin/academics/sections?status=success&message=Section updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update section");
    redirect(`/admin/academics/sections/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleSectionActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("sections").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/sections");
}

export async function deleteSectionAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const { count } = await supabase
      .from("academic_class_configs")
      .select("id", { count: "exact", head: true })
      .eq("section_id", id);

    if ((count ?? 0) > 0) throw new Error(`Cannot delete: ${count} class configuration(s) use this section.`);

    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/sections");
    redirect("/admin/academics/sections?status=success&message=Section deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete section");
    redirect(`/admin/academics/sections?status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── GROUPS ───────────────────────────────────────────────────────────────────

export async function createGroupAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Group name is required.");

    const { error } = await supabase.from("groups").insert({
      name,
      short_name: toNullableString(formData.get("short_name")),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/groups");
    redirect("/admin/academics/groups?status=success&message=Group created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create group");
    redirect(`/admin/academics/groups?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateGroupAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Group name is required.");

    const { error } = await supabase
      .from("groups")
      .update({
        name,
        short_name: toNullableString(formData.get("short_name")),
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
      })
      .eq("id", id);

    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/groups");
    redirect("/admin/academics/groups?status=success&message=Group updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update group");
    redirect(`/admin/academics/groups/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleGroupActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("groups").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/groups");
}

export async function deleteGroupAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const { count } = await supabase
      .from("academic_class_configs")
      .select("id", { count: "exact", head: true })
      .eq("group_id", id);

    if ((count ?? 0) > 0) throw new Error(`Cannot delete: ${count} class configuration(s) use this group.`);

    const { error } = await supabase.from("groups").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/groups");
    redirect("/admin/academics/groups?status=success&message=Group deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete group");
    redirect(`/admin/academics/groups?status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── SUBJECTS ─────────────────────────────────────────────────────────────────

export async function createSubjectDirectAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const name = toNullableString(formData.get("name"));
  const name_bn = toNullableString(formData.get("name_bn"));
  const code = toNullableString(formData.get("code"));
  if (!name) throw new Error("Subject name is required.");
  if (!code) throw new Error("Subject code is required.");

  const { data, error } = await supabase
    .from("subjects")
    .insert({
      name,
      name_bn,
      code: code.toUpperCase(),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    })
    .select()
    .single();

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error(`Subject code "${code}" already exists.`);
    throw error;
  }

  revalidateAcademicPaths("/admin/academics/subjects");
  return { success: true, data };
}

export async function createSubjectAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    const name_bn = toNullableString(formData.get("name_bn"));
    const code = toNullableString(formData.get("code"));
    if (!name) throw new Error("Subject name is required.");
    if (!code) throw new Error("Subject code is required.");

    const { error } = await supabase.from("subjects").insert({
      name,
      name_bn,
      code: code.toUpperCase(),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error(`Subject code "${code}" already exists.`);
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/subjects");
    redirect("/admin/academics/subjects?status=success&message=Subject created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create subject");
    redirect(`/admin/academics/subjects?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateSubjectDirectAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const name = toNullableString(formData.get("name"));
  const name_bn = toNullableString(formData.get("name_bn"));
  const code = toNullableString(formData.get("code"));
  if (!name) throw new Error("Subject name is required.");
  if (!code) throw new Error("Subject code is required.");

  const { error } = await supabase
    .from("subjects")
    .update({
      name,
      name_bn,
      code: code.toUpperCase(),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    })
    .eq("id", id);

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error(`Subject code "${code}" already exists.`);
    throw error;
  }

  revalidateAcademicPaths("/admin/academics/subjects");
  return { success: true };
}

export async function updateSubjectAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    const name_bn = toNullableString(formData.get("name_bn"));
    const code = toNullableString(formData.get("code"));
    if (!name) throw new Error("Subject name is required.");
    if (!code) throw new Error("Subject code is required.");

    const { error } = await supabase
      .from("subjects")
      .update({
        name,
        name_bn,
        code: code.toUpperCase(),
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
      })
      .eq("id", id);

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error(`Subject code "${code}" already exists.`);
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/subjects");
    redirect("/admin/academics/subjects?status=success&message=Subject updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update subject");
    redirect(`/admin/academics/subjects/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleSubjectActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("subjects").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/subjects");
}

export async function deleteSubjectAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    
    // Cascade delete from dependent tables first to avoid foreign key violations
    // 1. Delete from student_subjects
    await supabase.from("student_subjects").delete().eq("subject_id", id);

    // 2. Delete from subject_teachers
    await supabase.from("subject_teachers").delete().eq("subject_id", id);

    // 3. Delete from class_subjects
    await supabase.from("class_subjects").delete().eq("subject_id", id);

    // 4. Delete the subject itself
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/subjects");
    return { success: true };
  } catch (error) {
    const msg = resolveErrorMessage(error, "Failed to delete subject");
    return { success: false, error: msg };
  }
}

// ─── ACADEMIC CLASS CONFIGS ───────────────────────────────────────────────────

export async function createClassConfigAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const sessionId = toNullableString(formData.get("session_id"));
    const classId = toNullableString(formData.get("class_id"));
    if (!sessionId) throw new Error("Session is required.");
    if (!classId) throw new Error("Class is required.");

    const { error } = await supabase.from("academic_class_configs").insert({
      session_id: sessionId,
      version_id: toNullableString(formData.get("version_id")),
      shift_id: toNullableString(formData.get("shift_id")),
      class_id: classId,
      section_id: toNullableString(formData.get("section_id")),
      group_id: toNullableString(formData.get("group_id")),
      class_teacher_id: toNullableString(formData.get("class_teacher_id")),
      classroom_id: toNullableString(formData.get("classroom_id")),
      capacity: toNullableNumber(formData.get("capacity")),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) {
      if (isDuplicateKeyError(error)) {
        throw new Error("A class configuration with this exact Session / Version / Shift / Class / Section / Group combination already exists.");
      }
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/class-setup");
    redirect("/admin/academics/class-setup?status=success&message=Class configuration created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create class configuration");
    redirect(`/admin/academics/class-setup/new?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateClassConfigAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const sessionId = toNullableString(formData.get("session_id"));
    const classId = toNullableString(formData.get("class_id"));
    if (!sessionId) throw new Error("Session is required.");
    if (!classId) throw new Error("Class is required.");

    const { error } = await supabase
      .from("academic_class_configs")
      .update({
        session_id: sessionId,
        version_id: toNullableString(formData.get("version_id")),
        shift_id: toNullableString(formData.get("shift_id")),
        class_id: classId,
        section_id: toNullableString(formData.get("section_id")),
        group_id: toNullableString(formData.get("group_id")),
        class_teacher_id: toNullableString(formData.get("class_teacher_id")),
        classroom_id: toNullableString(formData.get("classroom_id")),
        capacity: toNullableNumber(formData.get("capacity")),
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      if (isDuplicateKeyError(error)) {
        throw new Error("A class configuration with this exact combination already exists.");
      }
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/class-setup");
    redirect(`/admin/academics/class-setup/${id}?status=success&message=Updated successfully`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update class configuration");
    redirect(`/admin/academics/class-setup/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleClassConfigActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("academic_class_configs")
    .update({ is_active: !currentlyActive, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/class-setup");
}

export async function deleteClassConfigAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    // class_subjects and subject_teachers will cascade delete automatically
    const { error } = await supabase.from("academic_class_configs").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/class-setup");
    redirect("/admin/academics/class-setup?status=success&message=Class configuration deleted");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete class configuration");
    redirect(`/admin/academics/class-setup?status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── CLASS SUBJECTS ───────────────────────────────────────────────────────────

export async function addClassSubjectAction(configId: string, subjectId: string, isOptional: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();

  // Get current max sort_order
  const { data: existing } = await supabase
    .from("class_subjects")
    .select("sort_order")
    .eq("academic_class_config_id", configId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = ((existing?.[0] as { sort_order?: number } | undefined)?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("class_subjects").insert({
    academic_class_config_id: configId,
    subject_id: subjectId,
    is_optional: isOptional,
    sort_order: nextOrder,
    student_type: isOptional ? "optional" : "mandatory",
    count_in_result: true,
    has_theory: true,
    theory_marks: 100,
    theory_exam_marks: 100,
    has_cq_mcq: false,
    cq_marks: null,
    mcq_marks: null,
    theory_pass_marks: 33,
    ca_marks: null,
    ca_pass_marks: null,
    has_practical: false,
    practical_marks: null,
    practical_pass_marks: null,
    total_pass_marks: 33,
  });

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error("Subject already assigned to this class configuration.");
    throw new Error(error.message);
  }

  revalidateAcademicPaths(`/admin/academics/class-setup/${configId}`);
}

export async function updateClassSubjectAction(
  id: string,
  configId: string,
  data: {
    subject_name_override: string | null;
    student_type: "mandatory" | "optional" | "religion" | "continuous_assessment" | "choice";
    count_in_result: boolean;
    paper_group_code: string | null;
    subject_groups: string[] | null;
    has_theory: boolean;
    theory_marks: number | null;
    theory_exam_marks: number | null;
    has_cq_mcq: boolean;
    cq_marks: number | null;
    mcq_marks: number | null;
    theory_pass_marks: number | null;
    ca_marks: number | null;
    ca_pass_marks: number | null;
    has_practical: boolean;
    practical_marks: number | null;
    practical_pass_marks: number | null;
    total_pass_marks: number | null;
  }
) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("class_subjects")
    .update({
      subject_name_override: data.subject_name_override,
      student_type: data.student_type,
      is_optional: data.student_type === "optional" || data.student_type === "choice",
      count_in_result: data.count_in_result,
      paper_group_code: data.paper_group_code ? data.paper_group_code.trim().toUpperCase() : null,
      subject_groups: data.subject_groups || [],
      has_theory: data.has_theory,
      theory_marks: data.has_theory ? data.theory_marks : null,
      theory_exam_marks: data.has_theory ? data.theory_exam_marks : null,
      has_cq_mcq: data.has_theory && data.has_cq_mcq,
      cq_marks: data.has_theory && data.has_cq_mcq ? data.cq_marks : null,
      mcq_marks: data.has_theory && data.has_cq_mcq ? data.mcq_marks : null,
      theory_pass_marks: data.has_theory ? data.theory_pass_marks : null,
      ca_marks: data.ca_marks,
      ca_pass_marks: data.ca_marks ? data.ca_pass_marks : null,
      has_practical: data.has_practical,
      practical_marks: data.has_practical ? data.practical_marks : null,
      practical_pass_marks: data.has_practical ? data.practical_pass_marks : null,
      total_pass_marks: data.total_pass_marks,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAcademicPaths(`/admin/academics/class-setup/${configId}`);
}

export async function removeClassSubjectAction(id: string, configId: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();

  // Also remove related teacher assignments and student subjects for this subject in this config
  const { data: cs } = await supabase
    .from("class_subjects")
    .select("subject_id")
    .eq("id", id)
    .maybeSingle<{ subject_id: string }>();

  if (cs?.subject_id) {
    // 1. Delete teacher assignments
    await supabase
      .from("subject_teachers")
      .delete()
      .eq("academic_class_config_id", configId)
      .eq("subject_id", cs.subject_id);

    // 2. Delete student assignments for this class config
    const { data: enrollments } = await supabase
      .from("student_enrollments")
      .select("id")
      .eq("academic_class_config_id", configId);

    if (enrollments && enrollments.length > 0) {
      const enrollmentIds = enrollments.map((e) => e.id);
      await supabase
        .from("student_subjects")
        .delete()
        .eq("subject_id", cs.subject_id)
        .in("enrollment_id", enrollmentIds);
    }
  }

  const { error } = await supabase.from("class_subjects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAcademicPaths(`/admin/academics/class-setup/${configId}`);
}

// ─── SUBJECT TEACHERS ─────────────────────────────────────────────────────────

export async function addSubjectTeacherAction(
  configId: string,
  subjectId: string,
  teacherId: string,
  assignmentType: "full" | "theory" | "practical"
) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("subject_teachers").insert({
    academic_class_config_id: configId,
    subject_id: subjectId,
    teacher_id: teacherId,
    assignment_type: assignmentType,
  });

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error("This teacher is already assigned to this subject with the same type.");
    throw new Error(error.message);
  }

  revalidateAcademicPaths(`/admin/academics/class-setup/${configId}`);
}

export async function removeSubjectTeacherAction(id: string, configId: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("subject_teachers").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAcademicPaths(`/admin/academics/class-setup/${configId}`);
}

// ─── ACADEMIC BUILDINGS ────────────────────────────────────────────────────────

export async function createBuildingDirectAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const name = toNullableString(formData.get("name"));
  if (!name) throw new Error("Building name is required.");

  const { data, error } = await supabase
    .from("academic_buildings")
    .insert({
      name,
      description: toNullableString(formData.get("description")),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    })
    .select()
    .single();

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error("A building with this name already exists.");
    throw error;
  }

  revalidateAcademicPaths("/admin/academics/classroom-management");
  return { success: true, data };
}

export async function createBuildingAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Building name is required.");

    const { error } = await supabase.from("academic_buildings").insert({
      name,
      description: toNullableString(formData.get("description")),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error("A building with this name already exists.");
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/classroom-management");
    redirect("/admin/academics/classroom-management?tab=buildings&status=success&message=Building created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create building");
    redirect(`/admin/academics/classroom-management/buildings/new?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateBuildingDirectAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const name = toNullableString(formData.get("name"));
  if (!name) throw new Error("Building name is required.");

  const { error } = await supabase
    .from("academic_buildings")
    .update({
      name,
      description: toNullableString(formData.get("description")),
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    })
    .eq("id", id);

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error("A building with this name already exists.");
    throw error;
  }

  revalidateAcademicPaths("/admin/academics/classroom-management");
  return { success: true };
}

export async function updateBuildingAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    if (!name) throw new Error("Building name is required.");

    const { error } = await supabase
      .from("academic_buildings")
      .update({
        name,
        description: toNullableString(formData.get("description")),
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
      })
      .eq("id", id);

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error("A building with this name already exists.");
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/classroom-management");
    redirect("/admin/academics/classroom-management?tab=buildings&status=success&message=Building updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update building");
    redirect(`/admin/academics/classroom-management/buildings/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleBuildingActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("academic_buildings").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/classroom-management");
}

export async function deleteBuildingDirectAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const { count } = await supabase
    .from("academic_classrooms")
    .select("id", { count: "exact", head: true })
    .eq("building_id", id);

  if ((count ?? 0) > 0) {
    return { success: false, error: `Cannot delete: ${count} classroom(s) are in this building.` };
  }

  const { error } = await supabase.from("academic_buildings").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidateAcademicPaths("/admin/academics/classroom-management");
  return { success: true };
}

export async function deleteBuildingAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const { count } = await supabase
      .from("academic_classrooms")
      .select("id", { count: "exact", head: true })
      .eq("building_id", id);

    if ((count ?? 0) > 0) throw new Error(`Cannot delete: ${count} classroom(s) are in this building.`);

    const { error } = await supabase.from("academic_buildings").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/classroom-management");
    redirect("/admin/academics/classroom-management?tab=buildings&status=success&message=Building deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete building");
    redirect(`/admin/academics/classroom-management?tab=buildings&status=error&message=${encodeURIComponent(msg)}`);
  }
}

// ─── ACADEMIC CLASSROOMS ──────────────────────────────────────────────────────

export async function createClassroomDirectAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const name = toNullableString(formData.get("name"));
  const buildingId = toNullableString(formData.get("building_id"));
  const floor = toNullableNumber(formData.get("floor"));
  const capacity = toNullableNumber(formData.get("capacity"));

  if (!name) throw new Error("Classroom name is required.");
  if (!buildingId) throw new Error("Building selection is required.");
  if (floor === null) throw new Error("Floor is required.");
  if (capacity === null) throw new Error("Capacity is required.");

  const { data, error } = await supabase
    .from("academic_classrooms")
    .insert({
      building_id: buildingId,
      name,
      floor,
      capacity,
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    })
    .select()
    .single();

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error("A classroom with this name already exists in this building.");
    throw error;
  }

  revalidateAcademicPaths("/admin/academics/classroom-management");
  return { success: true, data };
}

export async function createClassroomAction(formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    const buildingId = toNullableString(formData.get("building_id"));
    const floor = toNullableNumber(formData.get("floor"));
    const capacity = toNullableNumber(formData.get("capacity"));

    if (!name) throw new Error("Classroom name is required.");
    if (!buildingId) throw new Error("Building selection is required.");
    if (floor === null) throw new Error("Floor is required.");
    if (capacity === null) throw new Error("Capacity is required.");

    const { error } = await supabase.from("academic_classrooms").insert({
      building_id: buildingId,
      name,
      floor,
      capacity,
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    });

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error("A classroom with this name already exists in this building.");
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/classroom-management");
    redirect("/admin/academics/classroom-management?tab=classrooms&status=success&message=Classroom created successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to create classroom");
    redirect(`/admin/academics/classroom-management/classrooms/new?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function updateClassroomDirectAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const name = toNullableString(formData.get("name"));
  const buildingId = toNullableString(formData.get("building_id"));
  const floor = toNullableNumber(formData.get("floor"));
  const capacity = toNullableNumber(formData.get("capacity"));

  if (!name) throw new Error("Classroom name is required.");
  if (!buildingId) throw new Error("Building selection is required.");
  if (floor === null) throw new Error("Floor is required.");
  if (capacity === null) throw new Error("Capacity is required.");

  const { error } = await supabase
    .from("academic_classrooms")
    .update({
      building_id: buildingId,
      name,
      floor,
      capacity,
      is_active: toNullableBoolean(formData.get("is_active")) ?? true,
    })
    .eq("id", id);

  if (error) {
    if (isDuplicateKeyError(error)) throw new Error("A classroom with this name already exists in this building.");
    throw error;
  }

  revalidateAcademicPaths("/admin/academics/classroom-management");
  return { success: true };
}

export async function updateClassroomAction(id: string, formData: FormData) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const name = toNullableString(formData.get("name"));
    const buildingId = toNullableString(formData.get("building_id"));
    const floor = toNullableNumber(formData.get("floor"));
    const capacity = toNullableNumber(formData.get("capacity"));

    if (!name) throw new Error("Classroom name is required.");
    if (!buildingId) throw new Error("Building selection is required.");
    if (floor === null) throw new Error("Floor is required.");
    if (capacity === null) throw new Error("Capacity is required.");

    const { error } = await supabase
      .from("academic_classrooms")
      .update({
        building_id: buildingId,
        name,
        floor,
        capacity,
        is_active: toNullableBoolean(formData.get("is_active")) ?? true,
      })
      .eq("id", id);

    if (error) {
      if (isDuplicateKeyError(error)) throw new Error("A classroom with this name already exists in this building.");
      throw error;
    }

    revalidateAcademicPaths("/admin/academics/classroom-management");
    redirect("/admin/academics/classroom-management?tab=classrooms&status=success&message=Classroom updated successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to update classroom");
    redirect(`/admin/academics/classroom-management/classrooms/${id}/edit?status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function toggleClassroomActiveAction(id: string, currentlyActive: boolean) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("academic_classrooms").update({ is_active: !currentlyActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAcademicPaths("/admin/academics/classroom-management");
}

export async function deleteClassroomDirectAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("academic_classrooms").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidateAcademicPaths("/admin/academics/classroom-management");
  return { success: true };
}

export async function deleteClassroomAction(id: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("academic_classrooms").delete().eq("id", id);
    if (error) throw error;

    revalidateAcademicPaths("/admin/academics/classroom-management");
    redirect("/admin/academics/classroom-management?tab=classrooms&status=success&message=Classroom deleted successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = resolveErrorMessage(error, "Failed to delete classroom");
    redirect(`/admin/academics/classroom-management?tab=classrooms&status=error&message=${encodeURIComponent(msg)}`);
  }
}

export async function copyClassSubjectsAction(sourceConfigId: string, targetConfigId: string) {
  const adminId = await requireAdminSession();
  checkAdminRateLimit(adminId);

  try {
    const supabase = createSupabaseAdminClient();

    // 1. Fetch subjects from source config
    const { data: sourceSubjects, error: fetchErr } = await supabase
      .from("class_subjects")
      .select("*")
      .eq("academic_class_config_id", sourceConfigId);

    if (fetchErr) throw fetchErr;
    if (!sourceSubjects || sourceSubjects.length === 0) {
      throw new Error("Source configuration has no subjects to copy.");
    }

    // 2. Fetch enrollment IDs for target config (to clean up student_subjects)
    const { data: enrollments } = await supabase
      .from("student_enrollments")
      .select("id")
      .eq("academic_class_config_id", targetConfigId);

    const enrollmentIds = enrollments ? enrollments.map(e => e.id) : [];

    // 3. Clear target config's existing subjects and related data
    if (enrollmentIds.length > 0) {
      await supabase
        .from("student_subjects")
        .delete()
        .in("enrollment_id", enrollmentIds);
    }
    await supabase.from("subject_teachers").delete().eq("academic_class_config_id", targetConfigId);
    await supabase.from("class_subjects").delete().eq("academic_class_config_id", targetConfigId);

    // 4. Map and insert source subjects into target config
    const newClassSubjects = sourceSubjects.map(s => ({
      academic_class_config_id: targetConfigId,
      subject_id: s.subject_id,
      subject_name_override: s.subject_name_override,
      is_optional: s.is_optional,
      student_type: s.student_type,
      count_in_result: s.count_in_result,
      paper_group_code: s.paper_group_code,
      has_theory: s.has_theory,
      theory_marks: s.theory_marks,
      theory_exam_marks: s.theory_exam_marks,
      has_cq_mcq: s.has_cq_mcq,
      cq_marks: s.cq_marks,
      mcq_marks: s.mcq_marks,
      theory_pass_marks: s.theory_pass_marks,
      ca_marks: s.ca_marks,
      ca_pass_marks: s.ca_pass_marks,
      has_practical: s.has_practical,
      practical_marks: s.practical_marks,
      practical_pass_marks: s.practical_pass_marks,
      total_pass_marks: s.total_pass_marks,
      sort_order: s.sort_order
    }));

    const { error: insErr } = await supabase.from("class_subjects").insert(newClassSubjects);
    if (insErr) throw insErr;

    // 5. Automatically populate student_subjects for any enrolled students in target config
    if (enrollmentIds.length > 0) {
      const studentSubjectsToInsert: {
        enrollment_id: string;
        subject_id: string;
        subject_category: "Mandatory" | "Optional" | "Religion";
      }[] = [];

      const { data: studentsData } = await supabase
        .from("student_enrollments")
        .select(`
          id,
          student:students (
            religion
          )
        `)
        .in("id", enrollmentIds);

      const studentMap = new Map(
        (studentsData ?? []).map((se: any) => [se.id, se.student?.religion])
      );

      for (const eId of enrollmentIds) {
        const studentReligion = studentMap.get(eId);
        newClassSubjects.forEach((sub) => {
          let category: "Mandatory" | "Optional" | "Religion" = "Mandatory";
          if (sub.student_type === "optional") {
            category = "Optional";
          } else if (sub.student_type === "religion") {
            category = "Religion";
          }

          if (sub.student_type === "religion") {
            const subjectNameLower = (sub.subject_name_override || "").toLowerCase();
            const relStr = studentReligion ? studentReligion.toLowerCase() : "";

            let isMatch = false;
            if (relStr.includes("islam") && (subjectNameLower.includes("islam") || subjectNameLower.includes("makkah"))) {
              isMatch = true;
            } else if (relStr.includes("hindu") && (subjectNameLower.includes("hindu") || subjectNameLower.includes("sanatan"))) {
              isMatch = true;
            } else if (relStr.includes("christ") && (subjectNameLower.includes("christ") || subjectNameLower.includes("bible"))) {
              isMatch = true;
            } else if (relStr.includes("buddh") && (subjectNameLower.includes("buddh") || subjectNameLower.includes("pali"))) {
              isMatch = true;
            } else if (!relStr && (subjectNameLower.includes("islam") || subjectNameLower.includes("religion"))) {
              isMatch = true;
            }

            if (isMatch) {
              studentSubjectsToInsert.push({
                enrollment_id: eId,
                subject_id: sub.subject_id,
                subject_category: category,
              });
            }
          } else {
            studentSubjectsToInsert.push({
              enrollment_id: eId,
              subject_id: sub.subject_id,
              subject_category: category,
            });
          }
        });
      }

      if (studentSubjectsToInsert.length > 0) {
        await supabase.from("student_subjects").insert(studentSubjectsToInsert);
      }
    }

    revalidateAcademicPaths(`/admin/academics/class-setup/${targetConfigId}`);
    return { success: true };
  } catch (error) {
    const msg = resolveErrorMessage(error, "Failed to copy subject configuration");
    return { success: false, error: msg };
  }
}


