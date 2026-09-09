"use server"

import { createSupabaseAdminClient } from "@/lib/db"
import { sendContactNotificationEmail } from "@/lib/email"
import { getClientIpAddress, parseUserAgent } from "@/lib/user-agent-parser"
import { logContactFormError, logContactFormSuccess } from "@/lib/server-logger"
import { headers } from "next/headers"

export type ContactFormData = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  category?: string
}

const CONTACT_CATEGORIES = [
  { value: "admission", label: "Admission Inquiry" },
  { value: "complaint", label: "Complaint" },
  { value: "feedback", label: "Feedback" },
  { value: "general", label: "General Inquiry" },
  { value: "other", label: "Other" },
] as const

type ContactCategory = typeof CONTACT_CATEGORIES[number]["value"]

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate input
    if (!formData.name?.trim()) {
      return { success: false, message: "Name is required" }
    }
    if (!formData.email?.trim()) {
      return { success: false, message: "Email is required" }
    }
    if (!formData.subject?.trim()) {
      return { success: false, message: "Subject is required" }
    }
    if (!formData.message?.trim()) {
      return { success: false, message: "Message is required" }
    }

    // Validate category
    const category = (formData.category?.trim() || "general") as ContactCategory
    const validCategories = CONTACT_CATEGORIES.map((c) => c.value)
    if (!validCategories.includes(category)) {
      return { success: false, message: "Invalid category selected" }
    }

    // Get client info
    const headersList = await headers()
    const userAgent = headersList.get("user-agent") || ""
    const ipAddress = getClientIpAddress(headersList)
    const parsedUserAgent = parseUserAgent(userAgent)

    // Save to database
    const supabase = createSupabaseAdminClient()
    const { data: savedMessage, error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        category: category,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: "new",
        priority: "normal",
      })
      .select("id")
      .single()

    if (dbError) {
      logContactFormError(dbError, {
        stage: "database",
        details: { 
          email: formData.email,
          errorCode: dbError.code,
          errorMessage: dbError.message,
        },
      })
      // Log full error for debugging
      console.error("[DEBUG] Database error details:", {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
      })
      return {
        success: false,
        message: "We encountered an issue saving your message. Please try again in a moment.",
      }
    }

    // Send notification email to admin
    const emailResult = await sendContactNotificationEmail({
      senderName: formData.name.trim(),
      senderEmail: formData.email.trim(),
      senderPhone: formData.phone?.trim() || null,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      category: category,
      ipAddress: ipAddress,
      userAgent: parsedUserAgent.browser || "Unknown",
    })

    if (!emailResult.success) {
      logContactFormError(emailResult.error, {
        stage: "email",
        details: { 
          email: formData.email, 
          messageId: savedMessage?.id,
          errorDetails: emailResult.error,
        },
      })
      console.error("[CONTACT_FORM] Email sending failed but data saved:", {
        messageId: savedMessage?.id,
        senderEmail: formData.email,
        emailError: emailResult.error,
      })
      // Don't fail the form submission if email fails - data is still saved
    }

    // Log successful submission
    if (savedMessage?.id) {
      logContactFormSuccess(savedMessage.id, formData.email)
    }

    return {
      success: true,
      message: "Thank you! Your message has been received. We'll respond within 24 hours.",
      messageId: savedMessage?.id,
    }
  } catch (error) {
    logContactFormError(error, {
      stage: "validation",
      details: { email: formData.email },
    })
    return {
      success: false,
      message: "Something went wrong. Please try again or contact us directly.",
    }
  }
}
