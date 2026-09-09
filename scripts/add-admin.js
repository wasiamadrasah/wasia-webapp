const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
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

async function addAdmin(email, password, name = "Admin") {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into admins table
    const { data, error } = await supabase
      .from("admins")
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          role: "admin",
          full_name: name,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding admin:", error.message);
      process.exit(1);
    }

    console.log("✓ Admin user created successfully!");
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("\nThe user can now log in at: /admin/login");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || "Admin";

if (!email || !password) {
  console.log("Usage: node add-admin.js <email> <password> [name]");
  console.log("Example: node add-admin.js admin@example.com MyPassword123 'John Doe'");
  process.exit(1);
}

addAdmin(email, password, name);
