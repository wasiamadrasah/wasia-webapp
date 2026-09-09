export function getSafeImageSrc(value: string | null | undefined) {
  if (!value) return null

  const src = value.trim()

  if (!src) return null
  if (src.startsWith("/")) return src

  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      return new URL(src).toString()
    } catch {
      return null
    }
  }

  return null
}
