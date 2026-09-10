"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, ArrowRight, User } from "lucide-react"

export type TeacherCard = {
  id: string
  profile_photo: string | null
  full_name_en: string | null
  full_name_bn?: string | null
  designation: string | null
  email: string | null
  contact_number: string | null
  joining_date: string | null
  status?: string | null
}

interface TeacherGridProps {
  teachers: TeacherCard[]
}

export function TeacherGrid({ teachers }: TeacherGridProps) {
  if (teachers.length === 0) {
    return (
      <div className="card-appear rounded-2xl border border-dashed border-[#E2E7E4] bg-white p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54]">
          <User className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-bold text-[#17211E]">কোনো শিক্ষকের তথ্য পাওয়া যায়নি</h3>
        <p className="mt-1 text-[14.5px] text-[#5F6B67]">
          বর্তমানে কোনো সক্রিয় শিক্ষকের তথ্য তালিকাভুক্ত নেই।
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teachers.map((t, index) => {
        const displayName = t.full_name_bn || t.full_name_en || "সম্মানিত শিক্ষক"

        return (
          <div
            key={t.id}
            style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            className="card-appear group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs transition-colors duration-200 hover:border-[#075E54]/40 hover:shadow-md"
          >
            {/* Card Content Top Link */}
            <Link href={`/teachers/${t.id}`} className="block p-5 pb-3">
              {/* Photo Container with Rounded frame (No tilting/scaling) */}
              <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border-2 border-[#E2E7E4] bg-[#F7F8F5] p-1 shadow-2xs group-hover:border-[#075E54]/30 transition-colors">
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={t.profile_photo || "/avatar.png"}
                    alt={displayName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Teacher Information */}
              <div className="mt-4 text-center space-y-2">
                <h3 className="font-heading text-[17.5px] font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors line-clamp-1 leading-snug">
                  {displayName}
                </h3>

                {/* Designation Badge */}
                <div>
                  <span className="inline-flex items-center rounded-full bg-[#F0F7F5] border border-[#075E54]/15 px-3 py-0.5 text-[12.5px] font-semibold text-[#075E54] line-clamp-1">
                    {t.designation || "শিক্ষক"}
                  </span>
                </div>
              </div>
            </Link>

            {/* Card Footer: Quick Actions & Profile Link */}
            <div className="mt-2 border-t border-[#E2E7E4] bg-[#F7F8F5]/60 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                
                {/* Contact Action Icons */}
                <div className="flex items-center gap-1.5">
                  {t.contact_number && (
                    <a
                      href={`tel:${t.contact_number}`}
                      title={`কল করুন: ${t.contact_number}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white text-[#075E54] transition-colors duration-200 hover:bg-[#075E54] hover:text-white hover:border-[#075E54] shadow-2xs"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {t.email && (
                    <a
                      href={`mailto:${t.email}`}
                      title={`ইমেইল: ${t.email}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white text-[#B68A18] transition-colors duration-200 hover:bg-[#B68A18] hover:text-white hover:border-[#B68A18] shadow-2xs"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {/* View Profile Link */}
                <Link
                  href={`/teachers/${t.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#075E54]/20 px-3 py-1.5 text-[13px] font-semibold text-[#075E54] transition-colors duration-200 hover:bg-[#075E54] hover:text-white shadow-2xs group/btn ml-auto"
                >
                  <span>বিস্তারিত</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
