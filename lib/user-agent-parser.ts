/**
 * Parse user agent string to extract device and browser information
 */
export function parseUserAgent(userAgent: string) {
  if (!userAgent) {
    return {
      deviceType: "unknown",
      deviceName: "Unknown",
      browser: "Unknown",
      os: "Unknown",
    };
  }

  const ua = userAgent.toLowerCase();

  // Detect OS
  let os = "Unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("iphone")) os = "iOS";
  else if (ua.includes("ipad")) os = "iPadOS";
  else if (ua.includes("android")) os = "Android";

  // Detect browser
  let browser = "Unknown";
  if (ua.includes("chrome") && !ua.includes("chromium")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("edg")) browser = "Edge";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";

  // Detect device type
  let deviceType = "desktop";
  let deviceName = "Desktop";

  if (
    ua.includes("mobile") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    ua.includes("android")
  ) {
    deviceType = "mobile";
    if (ua.includes("iphone")) deviceName = "iPhone";
    else if (ua.includes("android")) deviceName = "Android Phone";
    else deviceName = "Mobile";
  } else if (ua.includes("ipad") || ua.includes("tablet")) {
    deviceType = "tablet";
    if (ua.includes("ipad")) deviceName = "iPad";
    else deviceName = "Tablet";
  }

  return {
    deviceType,
    deviceName,
    browser,
    os,
  };
}

export type RequestHeaderMap = Record<string, string | null | undefined> | Headers;

/**
 * Extract IP address from various possible headers
 */
export function getClientIpAddress(headers: RequestHeaderMap): string {
  if (!headers) return "unknown";

  const getHeader = (name: string): string | null | undefined => {
    if ("get" in headers && typeof headers.get === "function") {
      return headers.get(name);
    }
    return (headers as Record<string, string | null | undefined>)[name];
  };

  // Check various headers in order of preference
  const ip =
    getHeader("x-forwarded-for")?.split(",")[0].trim() ||
    getHeader("x-real-ip") ||
    getHeader("cf-connecting-ip") ||
    getHeader("x-client-ip") ||
    getHeader("x-forwarded") ||
    getHeader("forwarded-for") ||
    getHeader("forwarded") ||
    getHeader("remote-addr") ||
    "unknown";

  return typeof ip === "string" ? ip : "unknown";
}
