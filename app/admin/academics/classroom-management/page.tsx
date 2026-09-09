import { getAcademicBuildings, getAcademicClassrooms } from "@/lib/db"
import { AcademicSimpleTable, type ExtraColumnSpec } from "@/components/admin/academic-simple-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  toggleBuildingActiveAction,
  deleteBuildingAction,
  toggleClassroomActiveAction,
  deleteClassroomAction,
} from "@/app/admin/academics/actions"

function formatFloor(floor: number) {
  if (floor === 0) return "Ground Floor"
  const j = floor % 10
  const k = floor % 100
  if (j === 1 && k !== 11) return `${floor}st Floor`
  if (j === 2 && k !== 12) return `${floor}nd Floor`
  if (j === 3 && k !== 13) return `${floor}rd Floor`
  return `${floor}th Floor`
}

export default async function ClassroomManagementPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const activeTab = params.tab === "classrooms" ? "classrooms" : "buildings"

  const [buildings, classrooms] = await Promise.all([
    getAcademicBuildings(),
    getAcademicClassrooms(),
  ])

  const formattedClassrooms = classrooms.map((room) => ({
    ...room,
    floor_text: formatFloor(room.floor),
  }))

  const buildingColumns: ExtraColumnSpec[] = [
    {
      header: "Description",
      key: "description",
    },
  ]

  const classroomColumns: ExtraColumnSpec[] = [
    {
      header: "Building",
      key: "building_name",
    },
    {
      header: "Floor",
      key: "floor_text",
    },
    {
      header: "Capacity",
      key: "capacity",
      renderType: "capacity",
    },
  ]

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classroom Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage physical school facilities including academic buildings, floors, and classroom capacities.
        </p>
      </div>

      {params.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            params.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {params.message}
        </div>
      ) : null}

      <Tabs defaultValue={activeTab} className="w-full space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="space-y-4">
          <AcademicSimpleTable
            data={buildings}
            basePath="/admin/academics/classroom-management/buildings"
            addLabel="Add Building"
            filterPlaceholder="Filter buildings..."
            extraColumns={buildingColumns}
            toggleAction={toggleBuildingActiveAction}
            deleteAction={deleteBuildingAction}
            deleteWarning="This will permanently delete this building. This action cannot be undone and will fail if classrooms are assigned to it."
          />
        </TabsContent>

        <TabsContent value="classrooms" className="space-y-4">
          <AcademicSimpleTable
            data={formattedClassrooms}
            basePath="/admin/academics/classroom-management/classrooms"
            addLabel="Add Classroom"
            filterPlaceholder="Filter classrooms..."
            extraColumns={classroomColumns}
            toggleAction={toggleClassroomActiveAction}
            deleteAction={deleteClassroomAction}
            deleteWarning="This will permanently delete this classroom. This action cannot be undone."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
