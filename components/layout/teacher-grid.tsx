"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"

type TeacherCard = {
  id: string
  profile_photo: string | null
  full_name_en: string | null
  designation: string | null
  email: string | null
  contact_number: string | null
  joining_date: string | null
}

export function TeacherGrid({ teachers }: { teachers: TeacherCard[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teachers.map((t) => (
        <Link
          key={t.id}
          href={`/teachers/${t.id}`}
          className="group block"
        >
          <div className="relative rounded-lg border border-slate-150 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 overflow-hidden">

            {/* Square Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
              <Image
                src={t.profile_photo || "/avatar.png"}
                alt={t.full_name_en || "Teacher"}
                width={300}
                height={300}
                unoptimized
                className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="px-4 py-3.5 text-center bg-gradient-to-b from-white to-slate-50">
              <h2 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-600 transition uppercase tracking-widest line-clamp-2 leading-tight">
                {t.full_name_en || "Teacher"}
              </h2>

              <p className="mt-2 text-xs font-semibold text-teal-600 tracking-normal line-clamp-1 capitalize">
                {t.designation || "Teacher"}
              </p>

              {/* Divider */}
              <div className="my-3 h-px w-10 mx-auto bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

              {/* Contact Actions */}
              <div className="flex items-center justify-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                {t.contact_number && (
                  <button
                    type="button"
                    onClick={() => window.location.href = `tel:${t.contact_number}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-all duration-200 hover:bg-emerald-600 hover:text-white hover:shadow-md"
                    title={t.contact_number}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                )}

                {t.email && (
                  <button
                    type="button"
                    onClick={() => window.location.href = `mailto:${t.email}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition-all duration-200 hover:bg-teal-600 hover:text-white hover:shadow-md"
                    title={t.email}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
