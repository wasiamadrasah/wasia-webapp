import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer"

// ==========================================
// SMTP & Mailer Configuration
// ==========================================
const siteName =
  process.env.NEXT_PUBLIC_SITE_NAME ||
  process.env.NEXT_PUBLIC_SITE_SHORT_NAME ||
  "Wasia Madrasah"

const smtpUser =
  process.env.SMTP_USER ||
  process.env.GMAIL_USER ||
  process.env.GMAIL_EMAIL ||
  process.env.EMAIL_USER ||
  process.env.YAHOO_EMAIL ||
  ""

const smtpPass =
  process.env.SMTP_PASSWORD ||
  process.env.GMAIL_APP_PASSWORD ||
  process.env.GMAIL_PASSWORD ||
  process.env.EMAIL_PASS ||
  process.env.YAHOO_PASSWORD ||
  ""

const defaultFromName =
  process.env.EMAIL_FROM_NAME ||
  process.env.SMTP_FROM_NAME ||
  siteName

const defaultFromAddress =
  process.env.EMAIL_FROM_ADDRESS ||
  process.env.SMTP_FROM_EMAIL ||
  process.env.EMAIL_FROM ||
  smtpUser

const defaultReplyTo =
  process.env.EMAIL_REPLY_TO ||
  process.env.SMTP_REPLY_TO ||
  defaultFromAddress

const isSecurePort = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) === 465 : true)

// Create reusable transporter (supports Gmail service or custom host/port SMTP)
function createEmailTransporter(): Transporter {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure: isSecurePort,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
      },
    })
  }

  // Default to standard Gmail service
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
}

const transporter = createEmailTransporter()

/**
 * Format a sender address with display name
 * e.g., "Wasia Madrasah <notifications@wasiamadrasah.edu.bd>"
 */
export function formatSender(name?: string, email?: string): string {
  const resolvedName = name || defaultFromName
  const resolvedEmail = email || defaultFromAddress
  if (!resolvedEmail) return ""
  return resolvedName ? `"${resolvedName}" <${resolvedEmail}>` : resolvedEmail
}

/**
 * Verify transporter connectivity with SMTP server
 */
export async function verifyEmailConnection(): Promise<{ success: boolean; message: string }> {
  try {
    if (!smtpUser || !smtpPass) {
      return {
        success: false,
        message: "Email credentials (SMTP_USER/GMAIL_USER & SMTP_PASSWORD/GMAIL_APP_PASSWORD) are not configured.",
      }
    }
    await transporter.verify()
    return { success: true, message: "SMTP server is ready to send emails." }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to verify SMTP connection"
    console.error("[EMAIL_VERIFY] SMTP Connection verification failed:", errorMsg)
    return { success: false, message: errorMsg }
  }
}

/**
 * Core sendEmail helper
 */
export async function sendEmail(options: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  fromName?: string
  fromAddress?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: SendMailOptions["attachments"]
}) {
  try {
    if (!smtpUser || !smtpPass) {
      console.warn("[EMAIL] Mail credentials are not set. Skipping email sending.")
      return { success: false, error: "Email credentials not configured in environment" }
    }

    const from = formatSender(options.fromName, options.fromAddress)

    const mailOptions: SendMailOptions = {
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || defaultReplyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send email"
    console.error("[EMAIL] Error sending email:", {
      to: options.to,
      subject: options.subject,
      error: errorMessage,
    })
    return { success: false, error: errorMessage }
  }
}

// ==========================================
// Domain-Specific Email Dispatchers
// ==========================================

export async function sendOTPEmail(email: string, otp: string, adminName: string) {
  return sendEmail({
    to: email,
    fromName: `${siteName} Security`,
    subject: `Verify Your Email Address - ${siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 26px;">${siteName}</h1>
          <p style="margin: 6px 0 0 0; font-size: 16px; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">Hello ${adminName},</p>
          
          <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
            You requested to change or verify your account email address. Please use the following One-Time Password (OTP) to complete the action:
          </p>
          
          <div style="background: white; border: 2px solid #059669; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Your OTP Code</p>
            <p style="margin: 0; font-size: 44px; color: #059669; font-weight: bold; letter-spacing: 8px;">${otp}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0;">This OTP is valid for <strong>15 minutes</strong>.</p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Security Warning:</strong> Never share this OTP with anyone. The ${siteName} support team will never ask for your verification code.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; margin-bottom: 0;">
            If you did not request this verification, you can safely ignore this email.
          </p>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}

type TeacherWelcomeEmailPayload = {
  email: string
  teacherName: string
  username: string
  temporaryPassword: string
  instituteName?: string
}

export async function sendTeacherWelcomeEmail({
  email,
  teacherName,
  username,
  temporaryPassword,
  instituteName,
}: TeacherWelcomeEmailPayload) {
  const displayInstituteName = instituteName?.trim() || siteName

  return sendEmail({
    to: email,
    fromName: displayInstituteName,
    subject: `Welcome to ${displayInstituteName} - Your Staff Portal Credentials`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%); color: white; padding: 28px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Welcome to ${displayInstituteName}</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Teacher & Staff Portal Access</p>
        </div>

        <div style="background: #f8fafc; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #1f2937; font-size: 16px; margin-top: 0;">Hello ${teacherName || "Teacher"},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Your teacher account has been configured. You can use the credentials below to log in to the staff portal:
          </p>

          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>Username / Login:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${username}</span></p>
            <p style="margin: 0; color: #334155; font-size: 15px;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</span></p>
          </div>

          <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 12px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.5;">
              <strong>Security recommendation:</strong> Please change your temporary password immediately upon your first sign-in.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">
            If you have any questions or did not expect this account, please contact the administration office.
          </p>
        </div>

        <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} ${displayInstituteName}. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}

type TeacherPasswordResetEmailPayload = {
  email: string
  teacherName: string
  temporaryPassword: string
  instituteName?: string
}

export async function sendTeacherPasswordResetEmail({
  email,
  teacherName,
  temporaryPassword,
  instituteName,
}: TeacherPasswordResetEmailPayload) {
  const displayInstituteName = instituteName?.trim() || siteName

  return sendEmail({
    to: email,
    fromName: `${displayInstituteName} Administration`,
    subject: `Password Reset Notification - ${displayInstituteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); color: white; padding: 28px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Staff Account Security</p>
        </div>

        <div style="background: #f8fafc; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #1f2937; font-size: 16px; margin-top: 0;">Hello ${teacherName || "Teacher"},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Your account password has been reset by an administrator for <strong>${displayInstituteName}</strong>.
          </p>

          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #334155; font-size: 15px;"><strong>New Temporary Password:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</span></p>
          </div>

          <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 12px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.5;">
              <strong>Important:</strong> Please log in and set a new secure password right away.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">
            If you did not request this password reset, please notify the administration immediately.
          </p>
        </div>

        <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} ${displayInstituteName}. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}

type ContactNotificationEmailPayload = {
  senderName: string
  senderEmail: string
  senderPhone: string | null
  subject: string
  message: string
  category: string
  ipAddress: string | null
  userAgent: string
}

export async function sendContactNotificationEmail({
  senderName,
  senderEmail,
  senderPhone,
  subject,
  message,
  category,
  ipAddress,
  userAgent,
}: ContactNotificationEmailPayload) {
  const adminRecipient =
    (category === "admission" && process.env.ADMISSION_NOTIFICATION_EMAIL) ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    defaultFromAddress

  if (!adminRecipient) {
    console.error("[EMAIL] No recipient configured for contact form notifications")
    return { success: false, error: "Notification recipient not configured" }
  }

  const categoryLabel = {
    admission: "🎓 Admission Inquiry",
    complaint: "⚠️ Complaint",
    feedback: "💬 Feedback",
    general: "ℹ️ General Inquiry",
    other: "📌 Other",
  }[category] || "📧 General Inquiry"

  return sendEmail({
    to: adminRecipient,
    replyTo: senderEmail,
    fromName: `${siteName} Website Inquiries`,
    subject: `[${category.toUpperCase()}] ${subject} - from ${senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 28px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">New Contact Message</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">${siteName} Portal</p>
        </div>

        <div style="background: #f9fafb; padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af; font-weight: 600;">Category: ${categoryLabel}</p>
          </div>

          <div style="background: white; border-left: 4px solid #059669; padding: 16px; margin-bottom: 20px; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 8px 0; color: #374151;"><strong>Sender Name:</strong> ${senderName}</p>
            <p style="margin: 0 0 8px 0; color: #374151;"><strong>Email Address:</strong> <a href="mailto:${senderEmail}" style="color: #059669; text-decoration: none;">${senderEmail}</a></p>
            ${senderPhone ? `<p style="margin: 0 0 8px 0; color: #374151;"><strong>Phone Number:</strong> ${senderPhone}</p>` : ""}
            <p style="margin: 0; color: #374151;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="background: white; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 20px; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Message Body</h3>
            <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
          </div>

          <div style="background: #f3f4f6; padding: 12px; border-radius: 4px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0 0 4px 0;"><strong>IP Address:</strong> ${ipAddress || "Not available"}</p>
            <p style="margin: 0 0 4px 0;"><strong>Browser/Client:</strong> ${userAgent}</p>
            <p style="margin: 0;"><strong>Submitted On:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 13px;">
              💡 <em>Tip: You can reply directly to this email to respond back to ${senderName}.</em>
            </p>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}

export async function sendAdminPromotionEmail({
  to,
  name,
  temporaryPassword,
  loginUrl,
  instituteName,
}: {
  to: string
  name: string
  temporaryPassword: string
  loginUrl?: string
  instituteName?: string
}) {
  const displayInstituteName = instituteName || siteName
  const resolvedLoginUrl = loginUrl || `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/login`

  return sendEmail({
    to,
    fromName: `${displayInstituteName} Administration`,
    subject: `Congratulations! You have been granted Administrator privileges - ${displayInstituteName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: white; padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Privilege Promotion</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">${displayInstituteName} Portal</p>
        </div>

        <div style="background: #ffffff; padding: 32px 24px; color: #1e293b;">
          <p style="margin-top: 0; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            You have been officially granted <strong>Administrator (Admin)</strong> privileges in the system. You now have dual-role access to manage administrative features alongside your existing academic role.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Your Administrator Credentials</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Admin Portal URL:</strong> <a href="${resolvedLoginUrl}" style="color: #4f46e5; text-decoration: none;">${resolvedLoginUrl}</a></p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Login Email:</strong> <span style="font-family: monospace; color: #0f172a;">${to}</span></p>
            <p style="margin: 0; font-size: 14px;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: 700; color: #4f46e5; background: #e0e7ff; padding: 2px 8px; border-radius: 4px; border: 1px solid #c7d2fe;">${temporaryPassword}</span></p>
          </div>

          <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 14px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.6;">
              🔒 <strong>Important Security Instructions:</strong>
            </p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #854d0e; font-size: 13px; line-height: 1.6;">
              <li>Change your temporary password immediately upon your first administrator login.</li>
              <li>Keep your administrator credentials confidential and never share them with anyone.</li>
              <li>Always sign out after completing administrative tasks on shared devices.</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 28px 0 16px 0;">
            <a href="${resolvedLoginUrl}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);">Sign In to Admin Portal</a>
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
            If you have any questions or did not expect this privilege assignment, please contact the administration immediately.
          </p>
        </div>

        <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} ${displayInstituteName}. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}

