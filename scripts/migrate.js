const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'migrations');

// Initial base tables SQL if not exists
const baseTablesSql = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  full_name varchar(255),
  profile_photo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_roles (
  user_id text NOT NULL PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('superadmin', 'admin', 'principal')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  status text DEFAULT 'success' CHECK (status IN ('success', 'failed', 'warning')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
`;

const baseTempFile = path.join(__dirname, '..', 'migrations', '_000_base_tables.sql');
fs.writeFileSync(baseTempFile, baseTablesSql);

const order = [
  '_000_base_tables.sql',
  'staffs.sql',
  'staff_academics.sql',
  'staff_accounts.sql',
  'staff_adresses.sql',
  'staff_experience.sql',
  'staff_family.sql',
  'staffs_government_info.sql',
  'staffs_training.sql',
];

// Add 002 to 054
const allFiles = fs.readdirSync(migrationsDir);
const numberedFiles = allFiles
  .filter(f => /^\d{3}_/.test(f) && f !== '001_rls_policies.sql')
  .sort();

const fullOrder = [...order, ...numberedFiles, '001_rls_policies.sql'];

console.log(`Starting migration of ${fullOrder.length} files...`);

for (const file of fullOrder) {
  const filePath = path.join(migrationsDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing file: ${file}`);
    continue;
  }
  console.log(`Running: ${file}...`);
  try {
    execSync(`npx supabase db query --linked --file "${filePath}"`, {
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    console.log(`✅ ${file} SUCCESS`);
  } catch (err) {
    console.error(`❌ Error in ${file}:`, err.stderr || err.stdout || err.message);
  }
}

try {
  fs.unlinkSync(baseTempFile);
} catch (e) {}

console.log('Finished all migrations.');
