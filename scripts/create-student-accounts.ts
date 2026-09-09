import { createClient } from "@supabase/supabase-js"
import { hash } from "bcryptjs"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase credentials in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})

async function run() {
  console.log("Checking if student_accounts table exists...")
  
  // Test if student_accounts table is queryable
  const { error: tableCheckError } = await supabase
    .from("student_accounts")
    .select("id")
    .limit(1)

  if (tableCheckError) {
    console.error("❌ Error querying student_accounts table:", tableCheckError.message)
    console.log("\n💡 IMPORTANT: You must first run the SQL migration inside migrations/051_create_student_accounts.sql in your Supabase SQL Editor to create the table!")
    process.exit(1)
  }

  console.log("Table exists! Fetching active students...")
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, student_uid, email, status")
    .eq("status", "active")

  if (studentsError) {
    console.error("❌ Error fetching students:", studentsError.message)
    process.exit(1)
  }

  if (!students || students.length === 0) {
    console.log("No active students found to create accounts for.")
    process.exit(0)
  }

  console.log(`Found ${students.length} active students. Generating credentials...`)

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const student of students) {
    try {
      // Check if account already exists
      const { data: existingAccount } = await supabase
        .from("student_accounts")
        .select("id")
        .eq("student_id", student.id)
        .maybeSingle()

      if (existingAccount) {
        skipCount++
        continue
      }

      // Hash password (use student_uid as default password)
      const hashedPassword = await hash(student.student_uid, 10)

      const { error: insertError } = await supabase
        .from("student_accounts")
        .insert({
          student_id: student.id,
          student_uid: student.student_uid,
          email: student.email || null,
          password_hash: hashedPassword,
          role: "student",
          status: "active"
        })

      if (insertError) {
        console.error(`❌ Failed to create account for student ${student.student_uid}:`, insertError.message)
        errorCount++
      } else {
        successCount++
      }
    } catch (err: any) {
      console.error(`❌ Unexpected error processing student ${student.student_uid}:`, err.message || err)
      errorCount++
    }
  }

  console.log("\n--- Sync Report ---")
  console.log(`✅ Accounts Created: ${successCount}`)
  console.log(`⏭️  Accounts Skipped (Already Exist): ${skipCount}`)
  console.log(`❌ Failures: ${errorCount}`)
  console.log("-------------------")
  console.log("💡 Students can log in using their student_uid (e.g. 26100001) as both UID/Email and Password.")
}

run().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
