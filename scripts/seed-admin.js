/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")
const bcrypt = require("bcryptjs")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Environment variables not set!")
  console.error("Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedAdminUser() {
  try {
    const testAdmin = {
      email: "sadiworkmail@gmail.com",
      password: "s01836650S@&#",
      role: "superadmin",
    }

    console.log("🔍 Checking if admin table exists...")

    // Try to check if admin exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from("admins")
      .select("id")
      .eq("email", testAdmin.email)
      .maybeSingle()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Error accessing admins table:", checkError.message)
      console.error("\n📋 Make sure the 'admins' table exists in Supabase with columns:")
      console.error("   - id (UUID, primary key)")
      console.error("   - email (TEXT, unique)")
      console.error("   - password_hash (TEXT)")
      console.error("   - role (TEXT)")
      console.error("   - created_at (TIMESTAMP)")
      process.exit(1)
    }

    if (existingAdmin) {
      console.log("✅ Admin user already exists:", testAdmin.email)
      process.exit(0)
    }

    console.log("🔐 Hashing password...")
    const hashedPassword = await bcrypt.hash(testAdmin.password, 10)

    console.log("📝 Creating admin user...")
    const { data, error } = await supabase
      .from("admins")
      .insert([
        {
          email: testAdmin.email,
          password_hash: hashedPassword,
          role: testAdmin.role,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("❌ Error creating admin user:", error.message)
      process.exit(1)
    }

    if (data && data[0]) {
      await supabase.from("admin_roles").upsert({
        user_id: data[0].id,
        role: "superadmin",
      })
    }

    console.log("\n✅ Admin user created successfully!")
    console.log("━".repeat(50))
    console.log("📧 Email:    ", testAdmin.email)
    console.log("🔑 Password: ", testAdmin.password)
    console.log("━".repeat(50))
    console.log("\n⚠️  IMPORTANT:")
    console.log("   1. Change this password after your first login!")
    console.log("   2. Do NOT use this in production!")
    console.log("   3. Visit http://localhost:3000/admin/login to login")
    console.log()

    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

seedAdminUser()
