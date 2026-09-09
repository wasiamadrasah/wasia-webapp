# Production Deployment Guide

This guide covers the complete process of deploying the School System application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Cloudflare R2 Setup](#cloudflare-r2-setup)
4. [Environment Configuration](#environment-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Post-Deployment Validation](#post-deployment-validation)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before deploying to production, ensure you have:

- [ ] A Supabase project (cloud.supabase.com)
- [ ] A Cloudflare account with R2 enabled
- [ ] A production domain (e.g., schoolsystem.example.com)
- [ ] A hosting platform (Vercel, AWS, DigitalOcean, etc.)
- [ ] Node.js 18+ and npm installed locally
- [ ] Git repository with the code

---

## Database Setup

### 1. Create Admin Roles Table

In your Supabase dashboard, go to **SQL Editor** and run:

```sql
CREATE TABLE IF NOT EXISTS public.admin_roles (
  user_id TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'principal')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create initial superadmin user
INSERT INTO public.admin_roles (user_id, role) 
VALUES ('your-admin-user-id', 'superadmin');
```

### 2. Create Audit Logs Table

```sql
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'warning')),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
```

### 3. Deploy RLS Policies

Run the complete RLS policy migration from `migrations/001_rls_policies.sql`:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the entire content of `migrations/001_rls_policies.sql`
4. Paste and execute
5. Verify: Check that all policies are created without errors

### 4. Create Storage Buckets

In Supabase Storage, create the following buckets:

- `teacher-photos` - For teacher profile photos and signatures
- `public-documents` - For public notices and event images

Set permissions:

- `teacher-photos`: Private (auth required)
- `public-documents`: Public read-only

---

## Cloudflare R2 Setup

### 1. Create R2 Bucket

1. Log in to Cloudflare Dashboard
2. Go to **R2** section
3. Create a bucket named `school-system`
4. Note the bucket name and endpoint

### 2. Generate API Credentials

1. In Cloudflare Dashboard, go to **My Profile** → **API Tokens**
2. Create a new token with:
   - **Permissions**: `Object Read` and `Object Write` for R2
   - **Resources**: Select your `school-system` bucket
3. Save the credentials:
   - `Access Key ID`
   - `Secret Access Key`

### 3. Configure CORS

In R2 bucket settings:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["Content-Type", "Authorization"]
  }
]
```

### 4. Set Up Custom Domain (Recommended)

1. Go to R2 bucket → **Settings**
2. Link a Custom Domain (e.g., `cdn.yourdomain.com`)
3. Update `.env` with the custom domain URL

---

## Environment Configuration

### 1. Generate Secrets

Generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

### 2. Create Production `.env.local`

Copy `.env.example` and fill in production values:

```bash
cp .env.example .env.local
```

Update with:

```bash
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=https://yourdomain.com

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

CLOUDFLARE_R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=<your-access-key>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<your-secret-key>
CLOUDFLARE_R2_BUCKET_NAME=school-system
CLOUDFLARE_R2_PUBLIC_URL=https://cdn.yourdomain.com
```

### 3. Configure Secrets for Deployment

For your hosting platform (Vercel, AWS, etc.):

- Add all environment variables from `.env.local`
- **Never** commit `.env.local` to git
- Use the platform's secret management for production

---

## Deployment Steps

### Option 1: Vercel Deployment

1. Connect your Git repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy:

```bash
vercel --prod
```

### Option 2: Self-Hosted (Docker)

1. Build the application:

```bash
npm run build
```

2. Create Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

3. Deploy to your server:

```bash
docker build -t school-system .
docker run -p 3000:80 --env-file .env.local school-system
```

### Option 3: AWS/DigitalOcean/Others

Follow your platform's Next.js deployment guide with:

- Build command: `npm run build`
- Start command: `npm start`
- Node version: 18+
- All environment variables configured

---

## Post-Deployment Validation

### 1. Verify Authentication

- [ ] Admin login works
- [ ] Teacher login works
- [ ] Logout clears session
- [ ] Protected routes redirect unauthenticated users

### 2. Verify Server Actions

- [ ] Teacher can update profile
- [ ] Admin can create/update notices
- [ ] Admin can create/update events
- [ ] File uploads go to R2

### 3. Verify RLS Policies

- [ ] Teachers can only see their own data
- [ ] Admins can see all data
- [ ] Public notices are accessible without auth

### 4. Verify Rate Limiting

Test with:

```bash
# Multiple rapid login attempts should trigger rate limit
for i in {1..10}; do curl -X POST https://yourdomain.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'; done
```

### 5. Check Audit Logs

In Supabase dashboard:

```sql
SELECT * FROM public.audit_logs LIMIT 10;
```

Should show recent mutations with user IDs and timestamps.

---

## Monitoring & Maintenance

### Regular Tasks

- [ ] Review audit logs weekly
- [ ] Check R2 bandwidth usage
- [ ] Monitor Supabase database size
- [ ] Review failed authentication attempts
- [ ] Backup database weekly

### Alerting Setup

Configure alerts for:

- Unusual authentication failure rate
- R2 bandwidth spike
- Large database mutations
- Audit log errors

### Security Rotation

- Rotate API keys every 90 days
- Rotate `NEXTAUTH_SECRET` annually
- Review and update RLS policies quarterly
- Update dependencies monthly

---

## Troubleshooting

### R2 Upload Fails

- [ ] Check bucket name matches `CLOUDFLARE_R2_BUCKET_NAME`
- [ ] Verify CORS configuration
- [ ] Check API credentials validity
- [ ] Review R2 bucket permissions

### Authentication Issues

- [ ] Verify `NEXTAUTH_SECRET` is set
- [ ] Check `NEXTAUTH_URL` matches domain
- [ ] Verify admin/staff accounts exist in database
- [ ] Check audit logs for failed attempts

### RLS Policy Conflicts

- Verify policies are created without errors
- Check user's admin role exists in `admin_roles` table
- Test policies with Supabase test queries
- Review policy conditions for logic errors

---

## Emergency Contacts & Resources

- Supabase Support: https://supabase.com/support
- Cloudflare Support: https://support.cloudflare.com
- Node.js Docs: https://nodejs.org/docs
- Next.js Docs: https://nextjs.org/docs
