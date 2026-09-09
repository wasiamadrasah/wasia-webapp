"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { GoverningBodyMemberRecord } from "@/lib/db"
import { EditIcon, MoreVertical, TrashIcon, Mail, Phone, User, Users } from "lucide-react"
import { deleteMemberAction } from "./actions"
import { DeleteMemberDialog } from "./delete-member-dialog"
import { EditMemberDialog } from "./edit-member-dialog"
import { NewMemberDialog } from "./new-member-dialog"

export function GoverningBodyMembersTable({
  members,
}: {
  members: GoverningBodyMemberRecord[]
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [editingMember, setEditingMember] = useState<GoverningBodyMemberRecord | null>(null)
  const [deletingMember, setDeletingMember] = useState<GoverningBodyMemberRecord | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteMemberAction(id)
    } finally {
      setIsLoading(false)
    }
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12 px-4 text-center">
        <div className="rounded-full bg-[#EEF2FF] p-3 mb-3">
          <Users className="h-6 w-6 text-[#4F46E5]" />
        </div>
        <h3 className="text-base font-bold text-foreground">No Governing Body Members</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
          No members have been added to the governing body yet. Click below to add the first member.
        </p>
        <NewMemberDialog triggerLabel="Add First Member" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-full space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-border bg-card shadow-2xs">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/40 border-b border-border">
              <TableHead className="text-sm font-bold text-foreground">Member</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Designation</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Category</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Contact Details</TableHead>
              <TableHead className="w-20 text-right text-sm font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/40 border-b border-border transition-colors">
                <TableCell className="py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-[#F1F5F9]">
                      {member.image_url ? (
                        <Image
                          src={member.image_url}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#EEF2FF] text-[#4F46E5] font-bold text-sm">
                          {member.name ? member.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-sm text-foreground">{member.name}</span>
                  </div>
                </TableCell>

                <TableCell className="py-3.5 text-sm font-medium text-foreground whitespace-nowrap">
                  {member.designation}
                </TableCell>

                <TableCell className="py-3.5 whitespace-nowrap">
                  <Badge variant="outline" className="rounded-full bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE] font-semibold text-xs px-3 py-1">
                    {member.category}
                  </Badge>
                </TableCell>

                <TableCell className="py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                  <div className="space-y-1">
                    {member.email && (
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                    )}
                    {!member.email && !member.phone && <span className="text-[#94A3B8]">-</span>}
                  </div>
                </TableCell>

                <TableCell className="py-3.5 text-right whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" disabled={isLoading}>
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingMember(member)
                          setIsEditOpen(true)
                        }}
                        className="cursor-pointer gap-2 text-sm"
                      >
                        <EditIcon className="h-4 w-4 text-[#4F46E5]" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setDeletingMember(member)
                          setIsDeleteOpen(true)
                        }}
                        className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
                      >
                        <TrashIcon className="h-4 w-4 text-rose-600" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View (Clean Single Outer Border) */}
      <div className="block md:hidden space-y-3">
        {members.map((member) => (
          <div key={member.id} className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-[#F1F5F9]">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#EEF2FF] text-[#4F46E5] font-bold text-sm">
                      {member.name ? member.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.designation}</p>
                </div>
              </div>
              <Badge variant="outline" className="rounded-full bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE] font-semibold text-xs px-2.5 py-0.5 shrink-0">
                {member.category}
              </Badge>
            </div>

            {(member.email || member.phone) && (
              <div className="space-y-1.5 text-xs text-muted-foreground pt-0.5">
                {member.email && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingMember(member)
                  setIsEditOpen(true)
                }}
                className="h-8 gap-1.5 text-xs font-semibold text-[#4F46E5] border-[#C7D2FE] bg-[#EEF2FF] hover:bg-[#E0E7FF]"
              >
                <EditIcon className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDeletingMember(member)
                  setIsDeleteOpen(true)
                }}
                className="h-8 gap-1.5 text-xs font-semibold text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <EditMemberDialog
        member={editingMember}
        open={isEditOpen}
        onOpenChange={(open) => setIsEditOpen(open)}
      />
      <DeleteMemberDialog
        member={deletingMember}
        open={isDeleteOpen}
        onOpenChange={(open) => setIsDeleteOpen(open)}
        onConfirm={async () => {
          if (deletingMember) {
            await handleDelete(deletingMember.id)
          }
          setDeletingMember(null)
        }}
      />
    </div>
  )
}
