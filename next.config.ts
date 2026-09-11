import type { NextConfig } from "next";

const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
const r2PublicHostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : undefined;
const remotePatterns = [
  ...(r2PublicHostname
    ? [
        {
          protocol: "https" as const,
          hostname: r2PublicHostname,
        },
      ]
    : []),
  {
    protocol: "https" as const,
    hostname: "media.wasiamadrasah.edu.bd",
  },
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https" as const,
    hostname: "pub-7bfa9c25642f441f8b9103ee0ba819af.r2.dev",
  },
  {
    protocol: "https" as const,
    hostname: "pub-a9563106eee34f548fa87cebf5a862b8.r2.dev",
  },
  {
    protocol: "https" as const,
    hostname: "*.r2.dev",
  },
] satisfies NonNullable<NextConfig["images"]>["remotePatterns"];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "lucide-react",
      "@mui/material",
      "@mui/icons-material",
      "recharts",
      "date-fns",
      "framer-motion",
    ],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns,
    // Optimize images for better performance
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 1 year (max cache-control)
    minimumCacheTTL: 31536000,
    // Device sizes for responsive images - optimized for common viewports
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for srcset generation
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Configured qualities to resolve unconfigured warnings
    qualities: [70, 75],
    // Dangerously allow SVG for blur placeholders
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js hydration and Framer Motion require inline scripts/styles
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images: R2 CDN (wildcard + custom domain), Unsplash, DiceBear avatars, data URIs
              `img-src 'self' data: blob: https://*.r2.dev https://media.wasiamadrasah.edu.bd https://images.unsplash.com https://api.dicebear.com${r2PublicHostname ? ` https://${r2PublicHostname}` : ""}`,
              // Fonts from Google
              "font-src 'self' https://fonts.gstatic.com",
              // API calls: Supabase project + DiceBear SVG CDN
              `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.dicebear.com`,
              // Media from R2 CDN and custom domain
              `media-src 'self' https://*.r2.dev https://media.wasiamadrasah.edu.bd${r2PublicHostname ? ` https://${r2PublicHostname}` : ""}`,
              // Allow Google Maps embeds in iframes
              "frame-src 'self' https://www.google.com https://maps.google.com",
              // Deny our site being framed by others (different from frame-src)
              "frame-ancestors 'none'",
              // Block all plugins (Flash, etc.)
              "object-src 'none'",
              // Baseline form submissions
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
