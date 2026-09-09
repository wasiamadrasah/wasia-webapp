export type IDGenerationConfig = {
  auto_generation: boolean
  prefix: string
  no_of_digits: number
  start_from: number
}

export type IDGenerationSettings = {
  staff: IDGenerationConfig
  student: IDGenerationConfig
}

export const defaultIDGenerationSettings: IDGenerationSettings = {
  staff: {
    auto_generation: true,
    prefix: "EMP",
    no_of_digits: 4,
    start_from: 1,
  },
  student: {
    auto_generation: true,
    prefix: "STD",
    no_of_digits: 4,
    start_from: 1,
  },
}

export function formatPreviewID(config: IDGenerationConfig): string {
  const prefix = (config.prefix || "").trim()
  const startFrom = Math.max(1, Number(config.start_from) || 1)
  const digits = Math.max(2, Math.min(10, Number(config.no_of_digits) || 4))
  const paddedNumber = String(startFrom).padStart(digits, "0")

  return `${prefix}${paddedNumber}`
}
