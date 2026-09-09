"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FormSelectOption = {
  value: string
  label: string
}

type FormSelectProps = {
  name: string
  id?: string
  defaultValue?: string | null
  placeholder?: string
  options: FormSelectOption[]
  required?: boolean
  invalid?: boolean
}

export function FormSelect({
  name,
  id,
  defaultValue,
  placeholder = "Select option",
  options,
  required = false,
  invalid = false,
}: FormSelectProps) {
  const [mounted, setMounted] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue ?? "")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
        <select
          id={id}
          name={name}
          required={required}
          defaultValue={defaultValue ?? ""}
          className={`h-8 w-full rounded-lg border bg-transparent px-2.5 text-sm ${invalid ? "border-red-500" : "border-input"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <>
      <input type="hidden" name={name} value={value} />
      {required ? <input type="text" value={value} onChange={() => {}} tabIndex={-1} autoComplete="off" required className="sr-only pointer-events-none absolute h-0 w-0 opacity-0" aria-hidden /> : null}
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id={id} className={`w-full ${invalid ? "border-red-500 focus-visible:ring-red-200" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}

