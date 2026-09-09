import { supabase } from "@/lib/supabase"
import { hash } from "bcryptjs"

export async function seedAdminUser() {
  try {
    // Test admin credentials
    const testAdmin = {
      email: "admin@school.com",
      password: "Admin@123456", // CHANGE THIS IN PRODUCTION
      role: "admin",
    }

    // Hash the password
    const hashedPassword = await hash(testAdmin.password, 10)

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from("admins")
      .select("id")
      .eq("email", testAdmin.email)
      .single()

    if (existingAdmin) {
      console.log("Admin user already exists:", testAdmin.email)
      return
    }

    // Insert new admin user
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
      console.error("Error creating admin user:", error)
      return
    }

    console.log("✅ Admin user created successfully!")
    console.log("📧 Email:", testAdmin.email)
    console.log("🔑 Password:", testAdmin.password)
    console.log("\n⚠️  IMPORTANT: Change the password after first login!")
  } catch (error) {
    console.error("Error:", error)
  }
}

// Run the seeding
seedAdminUser().then(() => {
  process.exit(0)
})
