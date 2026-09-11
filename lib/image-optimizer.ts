/**
 * Image optimization utilities for Cloudflare R2 images
 * Generates optimized URLs with resizing parameters
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "json" | "webp" | "avif" | "jp2";
}

/**
 * Generate a low-quality image placeholder (LQIP) as base64
 * For instant visual feedback while the main image loads
 */
export function generateBlurPlaceholder(color: string = "rgba(100,150,180,0.3)"): string {
  // Simple gradient SVG placeholder - lightweight and fast
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='${encodeURIComponent(color)}' width='1' height='1'/%3E%3C/svg%3E`;
}

/**
 * Generate an optimized R2 image URL with Cloudflare image transformation
 * Cloudflare Images API: https://developers.cloudflare.com/images/image-resizing/
 * 
 * Note: This works if Cloudflare Image Resizing is enabled on your account
 * Alternative: Use Next.js Image component which handles optimization server-side
 * 
 * @param imageUrl - Original R2 image URL
 * @param options - Optimization options (width, height, quality, format)
 * @returns Optimized image URL or original if not an R2 URL
 */
export function getOptimizedImageUrl(
  imageUrl: string | null | undefined,
  options: ImageOptimizationOptions = {}
): string {
  if (!imageUrl) {
    return "/placeholder.svg";
  }

  // Check if it's an R2 URL (pub-*.r2.dev, media.wasiamadrasah.edu.bd, etc.)
  const isR2Url =
    imageUrl.includes("r2.dev") ||
    imageUrl.includes("media.wasiamadrasah.edu.bd") ||
    imageUrl.includes("wasiamadrasah.edu.bd");

  if (!isR2Url) {
    return imageUrl;
  }

  const {
    width = 800,
    height,
    quality = 80,
    format = "auto",
  } = options;

  // Cloudflare Image Resizing format:
  // https://image.r2.dev/path?width=500&height=600&quality=85&format=webp
  
  const params = new URLSearchParams();
  
  if (width) params.set("width", width.toString());
  if (height) params.set("height", height.toString());
  if (quality) params.set("quality", quality.toString());
  if (format !== "auto") params.set("format", format);

  // If URL already has query params, combine them
  const separator = imageUrl.includes("?") ? "&" : "?";
  
  return `${imageUrl}${separator}${params.toString()}`;
}

/**
 * Get image dimensions for responsive srcset
 * Returns an object with width and srcSet string for use in img tags
 * 
 * @param imageUrl - Original image URL
 * @param sizes - Array of width sizes to generate
 * @returns Object with width and srcSet properties
 */
export function getResponsiveImageSrcSet(
  imageUrl: string | null | undefined,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  if (!imageUrl) {
    return {
      src: "/placeholder.svg",
      srcSet: "/placeholder.svg 1x",
      sizes: "100vw",
    };
  }

  // Generate srcSet entries: "url 1x, url 2x, url 3x"
  const srcSetEntries = sizes
    .map((size) => {
      const optimized = getOptimizedImageUrl(imageUrl, { width: size });
      return `${optimized} ${size}w`;
    })
    .join(", ");

  // Default responsive sizes
  const sizesAttribute =
    "(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px";

  return {
    src: getOptimizedImageUrl(imageUrl, { width: 800 }),
    srcSet: srcSetEntries,
    sizes: sizesAttribute,
  };
}

/**
 * Preload an image for better perceived performance
 * 
 * @param imageUrl - Image URL to preload
 * @param sizes - Optional media query sizes for responsive preloading
 */
export function preloadImage(imageUrl: string, sizes?: string): HTMLLinkElement | null {
  if (typeof document === "undefined") return null;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = getOptimizedImageUrl(imageUrl, { quality: 75 });
  
  if (sizes) {
    link.imageSizes = sizes;
  }

  return link;
}

/**
 * Generate srcSet for hero/banner images
 * Optimized for full-width display scenarios
 * 
 * @param imageUrl - Original image URL
 * @returns srcSet string for responsive hero images
 */
export function getHeroImageSrcSet(imageUrl: string | null | undefined): string {
  if (!imageUrl) return "";

  const heroSizes = [640, 1280, 1920, 2560];
  
  return heroSizes
    .map((size) => {
      const optimized = getOptimizedImageUrl(imageUrl, {
        width: size,
        height: Math.round(size * 0.562), // 16:9 aspect ratio
        quality: 85,
      });
      return `${optimized} ${size}w`;
    })
    .join(", ");
}

/**
 * Generate srcSet for profile/avatar images
 * Optimized for fixed-size scenarios (square images)
 * 
 * @param imageUrl - Original image URL
 * @param size - Base size in pixels
 * @returns Object with width, height and srcSet for avatars
 */
export function getAvatarImageSrcSet(
  imageUrl: string | null | undefined,
  size: number = 256
): {
  src: string;
  srcSet: string;
  width: number;
  height: number;
} {
  if (!imageUrl) {
    return {
      src: "/avatar.png",
      srcSet: "/avatar.png 1x, /avatar.png 2x",
      width: size,
      height: size,
    };
  }

  const densities = ["1x", "2x", "3x"];
  const srcSetEntries = densities
    .map((density) => {
      const multiplier = parseInt(density);
      const optimized = getOptimizedImageUrl(imageUrl, {
        width: size * multiplier,
        height: size * multiplier,
        quality: 85,
      });
      return `${optimized} ${density}`;
    })
    .join(", ");

  return {
    src: getOptimizedImageUrl(imageUrl, { width: size, height: size }),
    srcSet: srcSetEntries,
    width: size,
    height: size,
  };
}
