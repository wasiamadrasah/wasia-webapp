"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())

  if (columns.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-border/80 text-xs font-medium text-foreground/80 hover:text-foreground bg-background hover:bg-muted/50 rounded-lg transition-colors"
        >
          <SlidersHorizontal className="mr-1.5 size-3.5 text-muted-foreground" />
          <span>View Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] bg-card border border-border shadow-md rounded-xl p-1">
        <DropdownMenuLabel className="text-xs font-bold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
          Toggle Columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-border/60" />
        <div className="max-h-[260px] overflow-y-auto space-y-0.5">
          {columns.map((column) => {
            const headerTitle =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id.replace(/_/g, " ")

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-xs cursor-pointer rounded-lg py-1.5"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {headerTitle}
              </DropdownMenuCheckboxItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
