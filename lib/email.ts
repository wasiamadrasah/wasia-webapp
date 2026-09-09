import nodemailer from "nodemailer"

// Create reusable transporter for Yahoo Mail
const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.YAHOO_EMAIL,
    pass: process.env.YAHOO_PASSWORD, // Use Yahoo App Password
  },
})

export async function sendOTPEmail(email: string, otp: string, adminName: string) {
  try {
    const mailOptions = {
      from: process.env.YAHOO_EMAIL,
      to: email,
      subject: "Verify Your New Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Email Verification</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">Hello ${adminName},</p>
            
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              You requested to change your email address. To complete this action, please use the following One-Time Password (OTP):
            </p>
            
            <div style="background: white; border: 2px solid #059669; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Your OTP Code</p>
              <p style="margin: 0; font-size: 48px; color: #059669; font-weight: bold; letter-spacing: 8px;">${otp}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin: 20px 0;">This OTP will expire in 15 minutes.</p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Security Note:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; margin-bottom: 0;">
              If you didn't request this email verification, you can safely ignore this message.
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} School Admin System. All rights reserved.</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Failed to send OTP email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
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
  try {
    const displayInstituteName = instituteName?.trim() || "School System"

    const mailOptions = {
      from: process.env.YAHOO_EMAIL,
      to: email,
      subject: `Welcome to ${displayInstituteName} - Your Account Details`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%); color: white; padding: 28px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 26px;">Welcome to ${displayInstituteName}</h1>
          </div>

          <div style="background: #f8fafc; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #1f2937; font-size: 16px; margin-top: 0;">Hello ${teacherName || "Teacher"},</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6;">
              Your teacher account has been created successfully. You can use the following credentials to sign in:
            </p>

            <div style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: #334155;"><strong>Username:</strong> ${username}</p>
              <p style="margin: 0; color: #334155;"><strong>Password:</strong> ${temporaryPassword}</p>
            </div>

            <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 12px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.5;">
                <strong>Security recommendation:</strong> Please change your password immediately after your first login.
              </p>
            </div>

            <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">
              If you did not expect this account, please contact the school administration.
            </p>
          </div>

          <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} ${displayInstituteName}</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Failed to send teacher welcome email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
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
  try {
    const displayInstituteName = instituteName?.trim() || "School System"

    const mailOptions = {
      from: process.env.YAHOO_EMAIL,
      to: email,
      subject: `${displayInstituteName} - Password Reset Notification`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); color: white; padding: 28px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 26px;">Password Reset</h1>
          </div>

          <div style="background: #f8fafc; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #1f2937; font-size: 16px; margin-top: 0;">Hello ${teacherName || "Teacher"},</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6;">
              Your account password has been reset by an administrator for ${displayInstituteName}.
            </p>

            <div style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #334155;"><strong>New temporary password:</strong> ${temporaryPassword}</p>
            </div>

            <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 12px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.5;">
                <strong>Important:</strong> Please change your password as soon as possible after login.
              </p>
            </div>

            <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">
              If you did not expect this reset, contact administration immediately.
            </p>
          </div>

          <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} ${displayInstituteName}</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Failed to send teacher password reset email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
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
  try {
    const adminEmail = process.env.YAHOO_EMAIL
    if (!adminEmail) {
      console.error("[EMAIL] YAHOO_EMAIL environment variable is not set")
      return { success: false, error: "Admin email not configured" }
    }

    if (!process.env.YAHOO_PASSWORD) {
      console.error("[EMAIL] YAHOO_PASSWORD environment variable is not set")
      return { success: false, error: "Admin email password not configured" }
    }

    const categoryLabel = {
      admission: "🎓 Admission Inquiry",
      complaint: "⚠️ Complaint",
      feedback: "💬 Feedback",
      general: "ℹ️ General Inquiry",
      other: "📌 Other",
    }[category] || "📧 Inquiry"

    const mailOptions = {
      from: process.env.YAHOO_EMAIL,
      to: adminEmail,
      replyTo: senderEmail,
      subject: `[${category.toUpperCase()}] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 28px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>

          <div style="background: #f9fafb; padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; margin-bottom: 20px; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af; font-weight: 600;">${categoryLabel}</p>
            </div>

            <div style="background: white; border-left: 4px solid #059669; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
              <p style="margin: 0 0 8px 0; color: #374151;"><strong>From:</strong> ${senderName}</p>
              <p style="margin: 0 0 8px 0; color: #374151;"><strong>Email:</strong> <a href="mailto:${senderEmail}" style="color: #059669; text-decoration: none;">${senderEmail}</a></p>
              ${senderPhone ? `<p style="margin: 0 0 8px 0; color: #374151;"><strong>Phone:</strong> ${senderPhone}</p>` : ""}
              <p style="margin: 0; color: #374151;"><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
              <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
              <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
            </div>

            <div style="background: #f3f4f6; padding: 12px; border-radius: 4px; font-size: 12px; color: #6b7280;">
              <p style="margin: 0 0 4px 0;"><strong>IP Address:</strong> ${ipAddress || "Not available"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Browser:</strong> ${userAgent}</p>
              <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                This message was submitted via the contact form on your website. Reply directly to this email to respond to the sender.
              </p>
            </div>
          </div>

          <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} School Admin System. All rights reserved.</p>
          </div>
        </div>
      `,
    }

    console.log("[EMAIL] Sending contact notification to:", adminEmail)
    const info = await transporter.sendMail(mailOptions)
    console.log("[EMAIL] Contact notification sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[EMAIL] Failed to send contact notification email:", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { success: false, error: errorMessage }
  }
}
