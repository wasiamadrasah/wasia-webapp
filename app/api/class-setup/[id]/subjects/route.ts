import { NextResponse } from "next/server"
import { getClassSubjects } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const subjects = await getClassSubjects(id)
    return NextResponse.json(subjects)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
