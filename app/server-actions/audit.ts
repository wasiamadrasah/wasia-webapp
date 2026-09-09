"use server";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Lazy initialization to prevent build-time failures when env vars are not set
let _supabase: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase admin credentials not configured");
    }
    _supabase = createClient(url, key, { auth: { persistSession: false } });
  }
  return _supabase;
}

export interface AuditLogEntry {
  user_id: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  status: "success" | "failed" | "warning";
  error_message?: string;
}

/**
 * Log an audit entry to the database
 * @param entry - Audit log entry data
 */
export async function createAuditLog(entry: AuditLogEntry) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.warn("Audit log created without authenticated user");
    }

    const auditEntry = {
      user_id: entry.user_id,
      action: entry.action,
      table_name: entry.table_name,
      record_id: entry.record_id,
      old_values: entry.old_values,
      new_values: entry.new_values,
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,
      status: entry.status,
      error_message: entry.error_message,
      created_at: new Date().toISOString(),
    };

    const { error } = await getSupabaseAdmin()
      .from("audit_logs")
      .insert([auditEntry]);

    if (error) {
      console.error("Failed to create audit log:", error);
      // Don't throw - failing to log shouldn't break the transaction
    }
  } catch (error) {
    console.error("Audit logging error:", error);
    // Non-blocking error
  }
}

/**
 * Log teacher data mutation
 */
export async function logTeacherMutation(
  action: "create" | "update" | "delete",
  teacherId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
) {
  const session = await getServerSession(authOptions);

  await createAuditLog({
    user_id: session?.user?.id || "system",
    action: `teacher_${action}`,
    table_name: "teachers",
    record_id: teacherId,
    old_values: oldValues,
    new_values: newValues,
    status: "success",
  });
}

/**
 * Log notice data mutation
 */
export async function logNoticeMutation(
  action: "create" | "update" | "delete",
  noticeId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
) {
  const session = await getServerSession(authOptions);

  await createAuditLog({
    user_id: session?.user?.id || "system",
    action: `notice_${action}`,
    table_name: "notices",
    record_id: noticeId,
    old_values: oldValues,
    new_values: newValues,
    status: "success",
  });
}

/**
 * Log event data mutation
 */
export async function logEventMutation(
  action: "create" | "update" | "delete",
  eventId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
) {
  const session = await getServerSession(authOptions);

  await createAuditLog({
    user_id: session?.user?.id || "system",
    action: `event_${action}`,
    table_name: "events",
    record_id: eventId,
    old_values: oldValues,
    new_values: newValues,
    status: "success",
  });
}

/**
 * Log staff data mutation
 */
export async function logStaffMutation(
  action: "create" | "update" | "delete",
  staffId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
) {
  const session = await getServerSession(authOptions);

  await createAuditLog({
    user_id: session?.user?.id || "system",
    action: `staff_${action}`,
    table_name: "staff",
    record_id: staffId,
    old_values: oldValues,
    new_values: newValues,
    status: "success",
  });
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
  action: "login" | "logout" | "password_reset",
  userId: string,
  status: "success" | "failed" = "success",
  errorMessage?: string
) {
  await createAuditLog({
    user_id: userId,
    action: `auth_${action}`,
    table_name: "auth",
    status,
    error_message: errorMessage,
  });
}

/**
 * Retrieve audit logs with filtering
 */
export async function getAuditLogs(
  filters?: {
    user_id?: string;
    action?: string;
    table_name?: string;
    days?: number;
    limit?: number;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    // Verify user is admin
    const { data: adminRole, error: adminError } = await getSupabaseAdmin()
      .from("admin_roles")
      .select("*")
      .eq("user_id", session?.user?.id)
      .single();

    if (adminError || !adminRole) {
      throw new Error("Unauthorized: Admin access required");
    }

    let query = getSupabaseAdmin()
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters?.user_id) {
      query = query.eq("user_id", filters.user_id);
    }

    if (filters?.action) {
      query = query.eq("action", filters.action);
    }

    if (filters?.table_name) {
      query = query.eq("table_name", filters.table_name);
    }

    if (filters?.days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - filters.days);
      query = query.gte("created_at", daysAgo.toISOString());
    }

    const limit = filters?.limit || 100;
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error retrieving audit logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch audit logs",
    };
  }
}
