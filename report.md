# School System Repository Report

Date: 2026-04-02

## Scope

This report summarizes the current repository in `E:\WebDev\MERN-Stack\school-system`.

- Reviewed: application source, config, docs, migrations, scripts
- Excluded from deep analysis: `node_modules`, generated artifacts, and minified third-party assets

## Executive Summary

This is a Next.js 16 school platform with three major surfaces:

- Public website (`/(public)/*`) for institutional content
- Admin portal (`/admin/*`) for management and publishing
- Teacher portal (`/teacher/*`) for self-service profile and records

Core stack:

- Next.js 16 + React 19 + TypeScript
- NextAuth (credentials + JWT sessions)
- Supabase (PostgreSQL + storage)
- Cloudflare R2 (file uploads for general media/docs)
- Tailwind CSS v4 + shadcn/ui + Radix-style primitives

## Route and Module Map

### Public area

Main pages include home, about, admission, teachers, staffs, notices, news, blogs, events, contact, faq, gallery, policies, results, and detail routes such as:

- `app\(public)\notices\[id]\page.tsx`
- `app\(public)\news\[id]\page.tsx`
- `app\(public)\blogs\[id]\page.tsx`
- `app\(public)\events\[id]\page.tsx`
- `app\(public)\teachers\[id]\page.tsx`

### Admin area

Protected routes include:

- `app\admin\dashboard\page.tsx`
- `app\admin\teachers\page.tsx`
- `app\admin\staffs\page.tsx`
- `app\admin\notices\page.tsx`
- `app\admin\news\page.tsx`
- `app\admin\blogs\page.tsx`
- category and edit/new routes for notices/news/blogs

Admin mutations are centralized in `app\admin\actions.ts`.

### Teacher area

Protected routes include:

- `app\teacher\dashboard\page.tsx`
- `app\teacher\profile\page.tsx`
- `app\teacher\academics\page.tsx`
- `app\teacher\experience\page.tsx`
- `app\teacher\training\page.tsx`
- `app\teacher\family\page.tsx`
- `app\teacher\settings\page.tsx`

Teacher mutations are implemented in `app\teacher\actions.ts`.

### API routes

- `app\api\auth\[...nextauth]\route.ts` (NextAuth handler)
- `app\api\upload\route.ts` (authenticated upload endpoint, Cloudflare R2)

## Authentication and Authorization

Key files:

- `lib\auth.ts`
- `proxy.ts`
- `app\admin\layout.tsx`
- `app\teacher\layout.tsx`
- `next-auth.d.ts`

Highlights:

- Credentials login supports explicit role mode (`admin` vs `teacher`)
- JWT session strategy is used
- Route-level guards in middleware (`proxy.ts`)
- Layout-level role checks in both admin and teacher layouts
- Action-level authorization via helper guards (`requireAdminSession`, `requireTeacherId`)

## Data Layer and Storage

### Data access

- `lib\db.ts` is the main service/query layer
- `lib\supabase.ts` provides public anon Supabase client
- Server actions use privileged server-side access patterns

### Main tables inferred from code usage

- Auth/roles: `admins`, `staff_accounts`, `admin_roles`
- Staff/teacher domain: `staffs`, `staff_academics`, `staff_experience`, `staff_training`, `staff_family`
- Publishing: `notices`, `notice_categories`, `news_posts`, `news_categories`, `blog_posts`, `blog_categories`, `events`
- Audit: `audit_logs`

### Upload/media pipeline

- Teacher profile/signature uploads use Cloudflare R2 via `lib\r2.ts`
- General uploads use Cloudflare R2 via `lib\r2.ts` and `POST /api/upload`
- MIME and size validation are implemented per upload type

## Migrations Review

Files in `migrations\` include:

- `001_rls_policies.sql`
- `002_create_notices_table.sql`
- `003_create_notice_categories.sql`
- `004_harden_notice_category_consistency.sql`
- `005_create_news_and_blogs_tables.sql`
- additional legacy staff-related SQL files

Critical observation:

- `001_rls_policies.sql` references older table names (`teachers`, `teacher_*`, `staff`) while current app code uses `staffs` and `staff_*`.
- This mismatch indicates RLS policy migration drift and should be reconciled before production rollout.

## UI and Frontend Structure

- `components\ui\*` contains a large reusable primitive layer (buttons, dialogs, tables, sidebar, etc.)
- `components\admin\*` contains data-table heavy admin screens
- `components\forms\tiptap-editor.tsx` provides rich text editing for content modules
- Public and portal layouts are split and organized cleanly under `app\`

## Configuration and Ops Notes

Key files reviewed:

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `components.json`
- `README.md`
- `DEPLOYMENT_GUIDE.md`

Scripts:

- `npm run dev`, `npm run build`, `npm run start`, `npm run lint`

Operational docs expect:

- Supabase setup + storage buckets
- Cloudflare R2 credentials and CORS
- NextAuth secret and production URL settings

## Risks and Gaps

1. **RLS policy drift (high)**  
   Migration policy names and code table names are inconsistent.

2. **Large central files (medium)**  
   `app\admin\actions.ts` and `lib\db.ts` are substantial and may become maintenance bottlenecks.

3. **Feature completeness variance (medium)**  
   Some routes appear more mature than others (for example dashboard areas using static/demo-like data patterns in prior analysis artifacts).

4. **Lint/quality follow-up likely needed (medium)**  
   Existing repository artifacts indicate unresolved lint findings in some files/scripts.

## Strengths

- Clear separation between public/admin/teacher surfaces
- Consistent auth layering (middleware + layout + server action checks)
- Good use of server-side mutations for protected writes
- Audit logging pattern exists and is integrated into action flows
- Dual storage strategy supports both profile assets and general content uploads

## Recommended Next Actions

1. Reconcile and re-test RLS migrations against current table names.
2. Confirm all required production tables (`admin_roles`, `audit_logs`, etc.) exist and are indexed.
3. Resolve lint issues and enforce clean CI before release.
4. Consider modularizing oversized action/query files by domain (teacher, staff, notices, news/blogs).
5. Validate end-to-end behavior for auth, uploads, and publish flows in a production-like environment.
