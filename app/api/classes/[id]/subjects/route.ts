import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params
    const supabase = createSupabaseAdminClient()
    
    // 1. Fetch all academic class configuration IDs that match the master class_id
    const { data: configs, error: configError } = await supabase
      .from("academic_class_configs")
      .select("id")
      .eq("class_id", classId)
      
    if (configError) {
      return NextResponse.json({ error: configError.message }, { status: 500 })
    }
    
    if (!configs || configs.length === 0) {
      return NextResponse.json([])
    }
    
    const configIds = configs.map((c) => c.id)
    
    // 2. Fetch class subjects associated with those configuration IDs
    const { data, error } = await supabase
      .from("class_subjects")
      .select(`
        subject_id,
        subjects!subject_id (name, code)
      `)
      .in("academic_class_config_id", configIds)
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // 3. De-duplicate subjects by subject_id
    const uniqueMap = new Map()
    data?.forEach((row: any) => {
      if (row.subjects && row.subject_id) {
        uniqueMap.set(row.subject_id, {
          id: row.subject_id,
          name: row.subjects.name,
          code: row.subjects.code,
        })
      }
    })
    
    const sortedSubjects = Array.from(uniqueMap.values()).sort((a: any, b: any) => {
      const numA = parseInt(a.code, 10)
      const numB = parseInt(b.code, 10)
      
      const isNumA = !isNaN(numA) && /^\d+$/.test(String(a.code).trim())
      const isNumB = !isNaN(numB) && /^\d+$/.test(String(b.code).trim())
      
      if (isNumA && isNumB) {
        return numA - numB
      }
      
      const codeA = String(a.code || "")
      const codeB = String(b.code || "")
      return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: "base" })
    })
    
    return NextResponse.json(sortedSubjects)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
