"use client"

import Image from "next/image"
import { Mail, Phone, User } from "lucide-react"

export type StaffCard = {
  id: string
  profile_photo: string | null
  full_name_en: string | null
  full_name_bn?: string | null
  designation: string | null
  email: string | null
  contact_number: string | null
  joining_date: string | null
  type?: string | null
  status?: string | null
}

interface StaffGridProps {
  staffs: StaffCard[]
  contentTitle?: string
}

export function StaffGrid({ staffs, contentTitle }: StaffGridProps) {
  if (staffs.length === 0) {
    return (
      <div className="card-appear rounded-2xl border border-dashed border-[#E2E7E4] bg-white p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54]">
          <User className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-bold text-[#17211E]">কোনো কর্মকর্তা-কর্মচারীর তথ্য পাওয়া যায়নি</h3>
        <p className="mt-1 text-[14.5px] text-[#5F6B67]">
          বর্তমানে কোনো সক্রিয় তথ্য তালিকাভুক্ত নেই।
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {staffs.map((s, index) => {
        const displayName = s.full_name_bn || s.full_name_en || "সম্মানিত কর্মকর্তা/কর্মচারী"

        return (
          <div
            key={s.id}
            style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            className="card-appear group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs transition-colors duration-200 hover:border-[#075E54]/40 hover:shadow-md"
          >
            {/* Card Content Top Section */}
            <div className="p-5 pb-3">
              {/* Photo Container with Rounded frame (No tilting/scaling) */}
              <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border-2 border-[#E2E7E4] bg-[#F7F8F5] p-1 shadow-2xs group-hover:border-[#075E54]/30 transition-colors">
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={s.profile_photo || "/avatar.png"}
                    alt={displayName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Staff Information */}
              <div className="mt-4 text-center space-y-2">
                <h3 className="font-heading text-[17.5px] font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors line-clamp-1 leading-snug">
                  {displayName}
                </h3>

                {/* Designation Badge */}
                <div>
                  <span className="inline-flex items-center rounded-full bg-[#F0F7F5] border border-[#075E54]/15 px-3 py-0.5 text-[12.5px] font-semibold text-[#075E54] line-clamp-1">
                    {s.designation || contentTitle || "কর্মকর্তা / কর্মচারী"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer: Quick Contact Actions */}
            <div className="mt-2 border-t border-[#E2E7E4] bg-[#F7F8F5]/60 px-4 py-3">
              <div className="flex items-center justify-center gap-2">
                {s.contact_number && (
                  <a
                    href={`tel:${s.contact_number}`}
                    title={`কল করুন: ${s.contact_number}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white text-[#075E54] transition-colors duration-200 hover:bg-[#075E54] hover:text-white hover:border-[#075E54] shadow-2xs"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                )}

                {s.email && (
                  <a
                    href={`mailto:${s.email}`}
                    title={`ইমেইল: ${s.email}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white text-[#B68A18] transition-colors duration-200 hover:bg-[#B68A18] hover:text-white hover:border-[#B68A18] shadow-2xs"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}

                {!s.contact_number && !s.email && (
                  <span className="text-[12.5px] font-medium text-[#5F6B67]">
                    ওয়াসিয়া কামিল মাদ্রাসা
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
