"use client"

import * as React from "react"
import { type Column } from "@tanstack/react-table"
import { Check, PlusCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { FacetedFilterOption } from "./types"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: FacetedFilterOption[]
  isMulti?: boolean
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isMulti = true,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const rawFilterValue = column?.getFilterValue()

  const selectedValues = React.useMemo(() => {
    if (rawFilterValue === undefined || rawFilterValue === null || rawFilterValue === "") {
      return new Set<string>()
    }
    if (Array.isArray(rawFilterValue)) {
      return new Set<string>(rawFilterValue)
    }
    return new Set<string>([String(rawFilterValue)])
  }, [rawFilterValue])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed border-border/80 text-xs text-foreground/80 hover:text-foreground bg-background hover:bg-muted/50 rounded-lg transition-colors"
        >
          <PlusCircle className="mr-1.5 size-3.5 text-muted-foreground" />
          <span className="font-medium">{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1.5 h-3.5 bg-border" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden text-[10px]"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex items-center">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal text-[10px]"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1.5 py-0 font-normal text-[10px] bg-secondary text-secondary-foreground"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-card border border-border shadow-md rounded-xl" align="start">
        <Command className="bg-transparent">
          <CommandInput placeholder={`Filter ${title}...`} className="h-8 text-xs" />
          <CommandList className="max-h-[220px] p-1">
            <CommandEmpty className="text-xs py-3 text-center text-muted-foreground">
              No options found.
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isMulti) {
                        const newSelected = new Set(selectedValues)
                        if (isSelected) {
                          newSelected.delete(option.value)
                        } else {
                          newSelected.add(option.value)
                        }
                        const filterValues = Array.from(newSelected)
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        )
                      } else {
                        column?.setFilterValue(
                          isSelected ? undefined : option.value
                        )
                      }
                    }}
                    className="cursor-pointer text-xs flex items-center justify-between rounded-lg py-1.5 px-2 my-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-sm border border-primary/40 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="size-3" />
                      </div>
                      {option.icon && (
                        <option.icon className="size-3.5 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </div>
                    {typeof option.count === "number" ? (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-[10px] text-muted-foreground">
                        {option.count}
                      </span>
                    ) : facets?.get(option.value) ? (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-[10px] text-muted-foreground">
                        {facets.get(option.value)}
                      </span>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator className="my-1 bg-border/60" />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="cursor-pointer text-xs justify-center text-center font-medium text-destructive hover:bg-destructive/10 rounded-lg py-1.5"
                  >
                    <X className="mr-1.5 size-3.5" />
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
