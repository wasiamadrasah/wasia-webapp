"use client"

import * as React from "react"
import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-sm font-semibold text-foreground/80 tracking-wide", className)}>{title}</div>
  }

  const isSorted = column.getIsSorted()

  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "-ml-3 h-8 text-sm font-semibold text-foreground/80 hover:text-foreground data-[state=open]:bg-accent transition-colors",
              isSorted && "text-primary font-bold"
            )}
          >
            <span>{title}</span>
            {isSorted === "desc" ? (
              <ArrowDown className="ml-1.5 size-3.5 text-primary" />
            ) : isSorted === "asc" ? (
              <ArrowUp className="ml-1.5 size-3.5 text-primary" />
            ) : (
              <ChevronsUpDown className="ml-1.5 size-3.5 text-muted-foreground/70 opacity-60 group-hover:opacity-100" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40 bg-card border border-border shadow-md rounded-xl p-1">
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="cursor-pointer text-xs flex items-center gap-2 py-1.5"
          >
            <ArrowUp className="size-3.5 text-muted-foreground" />
            <span>Sort Ascending</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="cursor-pointer text-xs flex items-center gap-2 py-1.5"
          >
            <ArrowDown className="size-3.5 text-muted-foreground" />
            <span>Sort Descending</span>
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator className="my-1 bg-border/60" />
              <DropdownMenuItem
                onClick={() => column.toggleVisibility(false)}
                className="cursor-pointer text-xs flex items-center gap-2 py-1.5 text-muted-foreground hover:text-foreground"
              >
                <EyeOff className="size-3.5 text-muted-foreground" />
                <span>Hide Column</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
