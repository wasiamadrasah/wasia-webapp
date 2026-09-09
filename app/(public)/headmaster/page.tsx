import { Outfit } from "next/font/google"
import Image from "next/image"
import { Quote, Calendar, User, GraduationCap, Mail, Phone } from "lucide-react"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Headmaster",
  description: "Read the headmaster's message, profile, qualifications, contact information, and leadership vision.",
  path: "/headmaster",
  keywords: ["headmaster", "principal", "school leadership", "headmaster message"],
})

type CurrentHeadmaster = {
  name: string
  designation: string
  image: string
  joiningYear: string
  qualification: string
  email: string
  phone: string
  message: string
}

type FormerHeadmaster = {
  name: string
  period: string
}

const currentHeadmaster: CurrentHeadmaster = {
  name: "Nasima Yasmin",
  designation: "Headmaster (Acting)",
  image: "/images/personnel/headmaster.png",
  joiningYear: "Present",
  qualification: "M.Ed, B.Ed",
  email: "hm@pbcchs.edu.bd",
  phone: "+8801309131385",
  message: `Located in the heart of Chattogram—a land of unparalleled natural beauty—Purba Bakalia City Corporation High School stands as a proud symbol of educational excellence. Since its establishment in 2003, this esteemed institution has played a noteworthy role in nurturing and sharpening the intellect and potential of its students, paving the way for them to become capable and responsible citizens of the future.

Education is the cornerstone of human resource development and national progress. With this belief, Purba Bakalia City Corporation High School has been working tirelessly with well-structured plans to produce self-reliant, morally grounded, and skilled individuals who will contribute meaningfully to society. Alongside the academic curriculum, the school places great emphasis on the mental, physical, social, and moral development of its students. Our mission is to ensure academic excellence while also fostering character, discipline, and integrity.

To achieve this goal, our highly qualified and dedicated teaching staff have been putting in relentless effort. Each year, our students continue to demonstrate their merit in public examinations across the Science, Business Studies, and Humanities streams.

We live in an era driven by information and technology. In fulfilling the vision of a transparent, efficient, and digital Bangladesh, there is no alternative to embracing ICT. Keeping pace with the times, we have integrated modern technology into our administrative and academic systems. With the help of digital tools, we are efficiently managing student attendance, examination results, and academic records, and delivering timely updates to parents and guardians via SMS.

Our institution is not only focused on academics but also upholds a proud tradition of excellence in co-curricular activities. Whether it is the National Education Week, Creative Talent Search, Student Cabinet Elections, World Literature Reading Programs, or various other competitions—our students have consistently made their mark. The contributions of our Scout group and Red Crescent Unit in humanitarian and volunteer services are also extensive and commendable.

With the united efforts of students, teachers, and guardians, we believe this school will continue to uphold its rich heritage while moving confidently toward a brighter future.

With sincere gratitude,
Nasima Yasmin
Head Teacher
Purba Bakalia City Corporation High School`,
}

const formerHeadmasters: FormerHeadmaster[] = [
  {
    name: "Former Headmaster Name 1",
    period: "2018 - 2023",
  },
  {
    name: "Former Headmaster Name 2",
    period: "2012 - 2017",
  },
  {
    name: "Former Headmaster Name 3",
    period: "2007 - 2011",
  },
  {
    name: "Former Headmaster Name 4",
    period: "2003 - 2006",
  },
]

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function HeadmasterPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            <span>HEADMASTER’S DESK</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Office of the{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Headmaster
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Leadership, vision, and commitment shaping the future of education.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Head Teacher" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* Current Headmaster */}
      <section className="bg-slate-50 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
          {/* Profile */}
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-square w-full bg-slate-100">
                <Image
                  src={currentHeadmaster.image}
                  alt={currentHeadmaster.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  {currentHeadmaster.name}
                </h2>

                <p className="mt-1 text-sm font-medium text-emerald-700">
                  {currentHeadmaster.designation}
                </p>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{currentHeadmaster.joiningYear}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 text-slate-400" />
                    <span>{currentHeadmaster.qualification}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="break-all">{currentHeadmaster.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{currentHeadmaster.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <Quote className="h-6 w-6 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Headmaster’s Message
                  </h3>
                  <p className="text-sm text-slate-500">
                    A vision for excellence and progress
                  </p>
                </div>
              </div>

              <div className="space-y-5 whitespace-pre-line text-base leading-8 text-slate-700">
                {currentHeadmaster.message}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Former Headmasters */}
      <section className="bg-white px-6 py-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Former Head Teachers
            </h2>
            <p className="mt-3 text-slate-600">
              A legacy of leadership and educational service.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Working Period
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {formerHeadmasters.map((headmaster, index) => (
                    <tr key={headmaster.name} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {headmaster.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {headmaster.period}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-8 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              Legacy of Leadership
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
              Our institution’s progress has been shaped by visionary leaders
              whose dedication and service continue to inspire generations.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
