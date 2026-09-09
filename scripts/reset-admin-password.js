/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")
const bcrypt = require("bcryptjs")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials!")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function resetAdminPassword() {
  try {
    const testAdmin = {
      email: "admin@school.com",
      password: "Admin@123456",
      role: "admin",
    }

    console.log("🔐 Hashing password...")
    const hashedPassword = await bcrypt.hash(testAdmin.password, 10)

    console.log("📝 Updating admin password...")
    const { data, error } = await supabase
      .from("admins")
      .update({
        password_hash: hashedPassword,
      })
      .eq("email", testAdmin.email)
      .select()

    if (error) {
      console.error("❌ Error updating password:", error.message)
      process.exit(1)
    }

    if (!data || data.length === 0) {
      console.error("❌ Admin user not found!")
      process.exit(1)
    }

    console.log("\n✅ Password reset successfully!")
    console.log("━".repeat(50))
    console.log("📧 Email:    ", testAdmin.email)
    console.log("🔑 Password: ", testAdmin.password)
    console.log("━".repeat(50))
    console.log("\n🔗 Login at: http://localhost:3000/admin/login")
    console.log("\n⚠️  First time? Try these troubleshooting steps:")
    console.log("   1. Clear browser cache (Ctrl+Shift+Del)")
    console.log("   2. Try Incognito/Private mode")
    console.log("   3. Check browser console for errors (F12)")
    console.log()

    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

resetAdminPassword()
