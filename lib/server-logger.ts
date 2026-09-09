/**
 * Server-side logging utility
 * Logs errors safely without exposing sensitive information to clients
 */

type LogLevel = "info" | "warn" | "error"

interface LogContext {
  endpoint?: string
  userId?: string
  timestamp?: string
  [key: string]: unknown
}

function formatTimestamp(): string {
  return new Date().toISOString()
}

function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Only return the error message, not the full stack or details
    return error.message
  }
  return String(error)
}

export function serverLog(level: LogLevel, message: string, context?: LogContext) {
  // In production, this would send to a logging service (Sentry, LogRocket, etc.)
  // For now, we use console but with structured format
  const timestamp = formatTimestamp()
  const logEntry = {
    level,
    message,
    timestamp,
    ...context,
  }

  // Only log to console in development
  if (process.env.NODE_ENV === "development") {
    console[level](JSON.stringify(logEntry, null, 2))
  }
  // In production, you could send to external logging service here
  // Example: await sendToLoggingService(logEntry)
}

export function logContactFormError(
  error: unknown,
  context: { stage: "validation" | "database" | "email"; details?: unknown } = {
    stage: "database",
  }
) {
  const errorMessage = sanitizeError(error)

  serverLog("error", `Contact form error at ${context.stage} stage`, {
    stage: context.stage,
    error: errorMessage,
    ...(context.details === undefined ? {} : { details: context.details }),
  })
}

export function logContactFormSuccess(messageId: string, email: string) {
  serverLog("info", "Contact form submitted successfully", {
    messageId,
    email,
    source: "contact-form",
  })
}
