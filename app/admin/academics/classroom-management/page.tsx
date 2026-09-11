import { getAcademicBuildings, getAcademicClassrooms } from "@/lib/db"
import { BuildingsTable } from "@/components/admin/buildings-table"
import { ClassroomsTable } from "@/components/admin/classrooms-table"
import { PageHeader } from "@/components/digicampus/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, DoorOpen } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

type ClassroomManagementPageProps = {
  searchParams?: Promise<{ tab?: string }>
}

export default async function ClassroomManagementPage({
  searchParams,
}: ClassroomManagementPageProps) {
  const params = (await searchParams) ?? {}
  const activeTab = params.tab === "classrooms" ? "classrooms" : "buildings"

  const [buildings, classrooms] = await Promise.all([
    getAcademicBuildings(),
    getAcademicClassrooms(),
  ])

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Classroom Management"
        description="Manage campus facilities including academic buildings, floors, and classroom capacities."
      />

      <Tabs defaultValue={activeTab} className="w-full space-y-6">
        <TabsList className="grid w-full max-w-xs grid-cols-2 h-10 p-1 bg-muted/60 border border-border/80">
          <TabsTrigger
            value="buildings"
            className="flex items-center gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs"
          >
            <Building2 className="size-3.5" />
            <span>Buildings ({buildings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="classrooms"
            className="flex items-center gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs"
          >
            <DoorOpen className="size-3.5" />
            <span>Rooms ({classrooms.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="space-y-4 focus-visible:outline-none">
          <BuildingsTable data={buildings} classrooms={classrooms} />
        </TabsContent>

        <TabsContent value="classrooms" className="space-y-4 focus-visible:outline-none">
          <ClassroomsTable data={classrooms} buildings={buildings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
