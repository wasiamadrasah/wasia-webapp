"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FormDatePickerProps = {
  name?: string
  id?: string
  value?: string | null
  defaultValue?: string | null
  placeholder?: string
  required?: boolean
  invalid?: boolean
  onChange?: (dateStr: string) => void
  className?: string
}

function formatDateDisplay(date: Date | undefined) {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function parseDateInput(value: string | null | undefined) {
  const text = (value ?? "").trim()
  if (!text) return undefined

  const ddmmyyyyMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch
    const parsed = new Date(`${year}-${month}-${day}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }

  const isoDateMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoDateMatch) {
    const parsed = new Date(`${text}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }

  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function normalizeTypedDateInput(value: string) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 8)
  const day = digitsOnly.slice(0, 2)
  const month = digitsOnly.slice(2, 4)
  const year = digitsOnly.slice(4, 8)

  if (digitsOnly.length <= 2) return day
  if (digitsOnly.length <= 4) return `${day}/${month}`
  return `${day}/${month}/${year}`
}

function toIsoDate(date: Date | undefined) {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const MONTH_OPTIONS = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
]

export function FormDatePicker({
  name,
  id,
  value,
  defaultValue,
  placeholder = "DD/MM/YYYY",
  required = false,
  invalid = false,
  onChange,
  className,
}: FormDatePickerProps) {
  const isControlled = value !== undefined
  const initialDate = parseDateInput(isControlled ? value : defaultValue)
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(initialDate)
  const [month, setMonth] = React.useState<Date | undefined>(initialDate)
  const [displayValue, setDisplayValue] = React.useState(formatDateDisplay(initialDate))
  
  // Sync state if controlled
  React.useEffect(() => {
    if (isControlled && value !== undefined) {
      const newDate = parseDateInput(value)
      setDate(newDate)
      setDisplayValue(formatDateDisplay(newDate))
      if (newDate) setMonth(newDate)
    }
  }, [value, isControlled])

  const activeMonth = month ?? date ?? new Date()
  const activeYear = activeMonth.getFullYear()
  const yearOptions = React.useMemo(() => {
    const start = activeYear - 50
    const end = activeYear + 20
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }, [activeYear])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Input
        id={id}
        type="date"
        name={name}
        required={required}
        {...(isControlled ? { value: toIsoDate(initialDate) } : { defaultValue: toIsoDate(initialDate) })}
        onChange={e => onChange?.(e.target.value)}
        className={cn(
          "h-10 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary",
          invalid && "border-rose-500 focus-visible:ring-rose-200",
          className
        )}
      />
    )
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={toIsoDate(date)} />}
      {required ? <input type="text" value={toIsoDate(date)} onChange={() => {}} tabIndex={-1} autoComplete="off" required className="sr-only pointer-events-none absolute h-0 w-0 opacity-0" aria-hidden /> : null}
      <InputGroup className={cn("h-10 w-full rounded-lg border border-input bg-background shadow-2xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary", className)}>
        <InputGroupInput
          id={id}
          value={displayValue}
          placeholder={placeholder}
          inputMode="numeric"
          maxLength={10}
          pattern="\d{2}/\d{2}/\d{4}"
          className={cn("h-full text-sm text-foreground bg-transparent border-0 focus-visible:ring-0", invalid && "text-rose-600")}
          onChange={(e) => {
            const formattedInput = normalizeTypedDateInput(e.target.value)
            if (!isControlled) {
              setDisplayValue(formattedInput)
            }
            const parsed = parseDateInput(formattedInput)
            if (parsed) {
              if (!isControlled) {
                setDate(parsed)
                setMonth(parsed)
              }
              onChange?.(toIsoDate(parsed))
            } else if (!formattedInput.trim()) {
              if (!isControlled) {
                setDate(undefined)
              }
              onChange?.("")
            } else if (isControlled) {
              setDisplayValue(formattedInput)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton variant="ghost" size="icon-xs" className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="Select date">
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl"
              align="end"
              alignOffset={-8}
              sideOffset={10}
              onInteractOutside={(event) => {
                const target = event.target as HTMLElement | null
                if (target?.closest("[data-slot='select-content']")) {
                  event.preventDefault()
                }
              }}
            >
              <div className="grid grid-cols-2 gap-2 border-b border-border p-2.5 bg-muted/40">
                <Select
                  value={String(activeMonth.getMonth())}
                  onValueChange={(value) => {
                    const next = new Date(activeMonth)
                    next.setMonth(Number(value))
                    setMonth(next)
                  }}
                >
                  <SelectTrigger className="h-8 w-full border-input bg-background text-xs">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start" className="w-[var(--radix-select-trigger-width)]">
                    <SelectGroup>
                      {MONTH_OPTIONS.map((monthOption) => (
                        <SelectItem key={monthOption.value} value={monthOption.value} className="text-xs">
                          {monthOption.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  value={String(activeYear)}
                  onValueChange={(value) => {
                    const next = new Date(activeMonth)
                    next.setFullYear(Number(value))
                    setMonth(next)
                  }}
                >
                  <SelectTrigger className="h-8 w-full border-input bg-background text-xs">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start" className="w-[var(--radix-select-trigger-width)]">
                    <SelectGroup>
                      {yearOptions.map((yearOption) => (
                        <SelectItem key={yearOption} value={String(yearOption)} className="text-xs">
                          {yearOption}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Calendar
                mode="single"
                selected={date}
                month={month}
                captionLayout="label"
                classNames={{
                  month_caption: "hidden",
                }}
                onMonthChange={setMonth}
                onSelect={(selectedDate) => {
                  if (!isControlled) {
                    setDate(selectedDate)
                    setDisplayValue(formatDateDisplay(selectedDate))
                  }
                  onChange?.(toIsoDate(selectedDate))
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </>
  )
}
