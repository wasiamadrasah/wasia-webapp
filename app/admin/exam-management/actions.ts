"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseAdminClient } from "@/lib/db"

export async function createExamAction(formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const name = formData.get("name") as string
  const session_id = formData.get("session_id") as string
  const status = formData.get("status") as string

  if (!name || !session_id) {
    return { error: "Missing required fields" }
  }

  const { error } = await supabase.from("exams").insert({
    name,
    session_id,
    status: status || "active",
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/examinations")
  return { success: true, message: "Exam created successfully!" }
}

export async function updateExamAction(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const name = formData.get("name") as string
  const session_id = formData.get("session_id") as string
  const status = formData.get("status") as string

  if (!name || !session_id) {
    return { error: "Missing required fields" }
  }

  const { error } = await supabase
    .from("exams")
    .update({
      name,
      session_id,
      status: status || "active",
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/examinations")
  return { success: true, message: "Exam updated successfully!" }
}

export async function deleteExamAction(id: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("exams").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }
  revalidatePath("/admin/exam-management/examinations")
  return { success: true, message: "Exam deleted successfully!" }
}

export async function createExamScheduleAction(formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const exam_id = formData.get("exam_id") as string
  const class_id = formData.get("class_id") as string
  const subject_id = formData.get("subject_id") as string
  const exam_date = formData.get("exam_date") as string
  const start_time = formData.get("start_time") as string
  const end_time = formData.get("end_time") as string
  const room_id = formData.get("room_id") as string

  if (!exam_id || !class_id || !subject_id || !exam_date || !start_time || !end_time) {
    return { error: "Missing required fields" }
  }

  const { error } = await supabase.from("exam_schedules").insert({
    exam_id,
    class_id,
    subject_id,
    exam_date,
    start_time,
    end_time,
    room_id: room_id || null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/schedules")
  return { success: true, message: "Exam schedule created successfully!" }
}

export async function updateExamScheduleAction(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const exam_id = formData.get("exam_id") as string
  const class_id = formData.get("class_id") as string
  const subject_id = formData.get("subject_id") as string
  const exam_date = formData.get("exam_date") as string
  const start_time = formData.get("start_time") as string
  const end_time = formData.get("end_time") as string
  const room_id = formData.get("room_id") as string

  if (!exam_id || !class_id || !subject_id || !exam_date || !start_time || !end_time) {
    return { error: "Missing required fields" }
  }

  const { error } = await supabase
    .from("exam_schedules")
    .update({
      exam_id,
      class_id,
      subject_id,
      exam_date,
      start_time,
      end_time,
      room_id: room_id || null,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/schedules")
  return { success: true, message: "Exam schedule updated successfully!" }
}

export async function deleteExamScheduleAction(id: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("exam_schedules").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }
  revalidatePath("/admin/exam-management/schedules")
  return { success: true, message: "Exam schedule deleted successfully!" }
}

export async function createGradeScaleAction(formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) return { error: "Name is required" }

  const { error } = await supabase.from("grade_scales").insert({
    name,
    description: description || null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/grades")
  return { success: true, message: "Grade scale created successfully!" }
}

export async function deleteGradeScaleAction(id: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("grade_scales").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }
  revalidatePath("/admin/exam-management/grades")
  return { success: true, message: "Grade scale deleted successfully!" }
}

export async function createGradeScaleDetailAction(formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const grade_scale_id = formData.get("grade_scale_id") as string
  const grade_letter = formData.get("grade_letter") as string
  const grade_point = formData.get("grade_point") as string
  const min_percentage = formData.get("min_percentage") as string
  const max_percentage = formData.get("max_percentage") as string
  const remarks = formData.get("remarks") as string

  if (!grade_scale_id || !grade_letter || !grade_point || !min_percentage || !max_percentage) {
    return { error: "Missing required fields" }
  }

  const { error } = await supabase.from("grade_scale_details").insert({
    grade_scale_id,
    grade_letter,
    grade_point: parseFloat(grade_point),
    min_percentage: parseFloat(min_percentage),
    max_percentage: parseFloat(max_percentage),
    remarks: remarks || null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/grades")
  return { success: true, message: "Grade detail added successfully!" }
}

export async function deleteGradeScaleDetailAction(id: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from("grade_scale_details").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }
  revalidatePath("/admin/exam-management/grades")
  return { success: true, message: "Grade detail deleted successfully!" }
}

export async function updateGradeScaleAction(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) return { error: "Name is required" }

  const { error } = await supabase
    .from("grade_scales")
    .update({
      name,
      description: description || null,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/grades")
  return { success: true, message: "Grade scale updated successfully!" }
}

export async function updateGradeScaleDetailAction(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()
  const grade_letter = formData.get("grade_letter") as string
  const grade_point = formData.get("grade_point") as string
  const min_percentage = formData.get("min_percentage") as string
  const max_percentage = formData.get("max_percentage") as string
  const remarks = formData.get("remarks") as string

  if (!grade_letter || !grade_point || !min_percentage || !max_percentage) {
    return { error: "Missing required fields" }
  }

  const { error } = await supabase
    .from("grade_scale_details")
    .update({
      grade_letter,
      grade_point: parseFloat(grade_point),
      min_percentage: parseFloat(min_percentage),
      max_percentage: parseFloat(max_percentage),
      remarks: remarks || null,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/exam-management/grades")
  return { success: true, message: "Grade detail updated successfully!" }
}
