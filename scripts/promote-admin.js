const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function promoteAdmin(email) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find the admin user first
    const { data: admin, error: findError } = await supabase
      .from("admins")
      .select("id, email, full_name")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (findError) {
      console.error("Error checking admins table:", findError.message);
      process.exit(1);
    }

    if (!admin) {
      console.error(`No admin found with email: ${email}`);
      process.exit(1);
    }

    // Upsert their role in admin_roles table
    const { data, error } = await supabase
      .from("admin_roles")
      .upsert({
        user_id: admin.id,
        role: "superadmin"
      }, { onConflict: "user_id" })
      .select();

    if (error) {
      console.error("Error promoting admin to superadmin:", error.message);
      process.exit(1);
    }

    console.log(`✓ Admin user promoted successfully to superadmin!`);
    console.log(`Name:  ${admin.full_name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`UUID:  ${admin.id}`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: node scripts/promote-admin.js <email>");
  console.log("Example: node scripts/promote-admin.js sadiworkmail@gmail.com");
  process.exit(1);
}

promoteAdmin(email);
