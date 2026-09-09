# DigiCampus 2.0

DigiCampus 2.0 is a Next.js school management platform & public web portal built with NextAuth, Supabase, Tailwind CSS, and shadcn/ui.

## Current Scope

- Public school website with home, teachers, notices, events, and contact routes.
- Protected admin area with dashboard, teachers, staffs, notices, and events screens.
- Protected teacher area with dashboard, profile, academics, experience, training, family, and settings screens.
- Credentials-based authentication for admins and teachers.
- Server-side protected teacher mutations for profile, academics, experience, training, family, email, and password changes.

## Environment Variables

Create `.env.local` with the following values:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000  # Change to production URL in production

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=school-system
CLOUDFLARE_R2_PUBLIC_URL=https://your-r2-public-url.com  # Your Custom Domain or R2 Public URL
```

### Cloudflare R2 Setup

1. Create a bucket in Cloudflare R2
2. Generate API credentials (Access Key ID & Secret)
3. Configure CORS for your domain
4. Set up a Custom Domain for public access (optional but recommended)

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Hardening Checklist

### Application Security
- ✅ Server-side authenticated mutations for all protected routes
- ✅ Rate limiting enabled for auth endpoints (5 attempts per 15 minutes)
- ✅ Rate limiting enabled for admin mutations (50 per minute)
- ✅ Audit logging system implemented for all data mutations
- ✅ Cloudflare R2 integration for secure file storage

### Database Security - REQUIRED BEFORE PRODUCTION
- ⏳ **CRITICAL**: Deploy RLS (Row Level Security) policies using `migrations/001_rls_policies.sql`
- ⏳ Create `admin_roles` table with superadmin/admin/principal roles
- ⏳ Create `audit_logs` table for mutation tracking
- ⏳ Set up automated backups for all tables
- ⏳ Enable point-in-time recovery on Supabase

### Deployment Configuration
- ⏳ Restrict `SUPABASE_SERVICE_ROLE_KEY` to server environments only (never expose to frontend)
- ⏳ Set `NEXTAUTH_URL` to production domain
- ⏳ Rotate `NEXTAUTH_SECRET` before launch
- ⏳ Rotate Supabase API keys (use new keys for production)
- ⏳ Rotate Cloudflare R2 credentials
- ⏳ Configure CORS on R2 bucket for your production domain
- ⏳ Enable HTTPS/TLS everywhere
- ⏳ Set secure cookies for production: update `useSecureCookies: true` in `lib/auth.ts`

### Monitoring & Alerting
- ⏳ Set up Supabase edge function for audit log webhooks
- ⏳ Create dashboards for failed authentication attempts
- ⏳ Configure alerts for unusual mutation patterns
- ⏳ Enable Supabase function logs for troubleshooting
- ⏳ Monitor R2 bucket usage and bandwidth

### Operational Procedures
- ⏳ Create incident response playbook
- ⏳ Document admin onboarding procedures
- ⏳ Set up teacher password reset workflow
- ⏳ Create backup/recovery runbooks
- ⏳ Document rate limit handling for users

## Validation

The current codebase passes:

```bash
npm run lint
npm run build
```
