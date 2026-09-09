# Repository Report

Date: 2026-03-19

## Scope

This report is based on a scan of the current repository contents in `e:\WebDev\MERN-Stack\school-system`.

- Text files scanned: 165
- Approximate lines scanned: 20,315
- Excluded from deep review:
  - `.git/`
  - `.next/`
  - `node_modules/`
  - `package-lock.json`
  - binary assets such as `app/favicon.ico` and `public/images/footerbg.png`
  - `.env.local` was not inspected for secrets

## High-Level Summary

This is a Next.js 16 App Router project for a school website plus two protected portals:

- Public website for school information, notices, events, news, blogs, teachers, staffs, and contact.
- Admin portal for content management and teacher management.
- Teacher portal for profile and personal record management.

Core platform choices:

- Next.js 16 + React 19
- NextAuth credentials authentication
- Supabase for database and storage
- Cloudflare R2 for uploads
- Tailwind CSS v4 + shadcn/ui
- Tiptap for rich text editing

## Repository Shape

Top-level file distribution:

- `components`: 77 files
- `app`: 59 files
- `public`: 6 files
- `lib`: 6 files
- `migrations`: 5 files
- `scripts`: 3 files

Route counts:

- Public pages: 19
- Admin pages: 17
- Teacher pages: 8

Largest source files:

- `app/admin/actions.ts`: 1166 lines
- `lib/db.ts`: 664 lines
- `components/ui/sidebar.tsx`: 648 lines
- `app/(public)/page.tsx`: 597 lines
- `components/admin/notice-category-data-table.tsx`: 586 lines
- `components/admin/notice-data-table.tsx`: 525 lines
- `components/forms/tiptap-editor.tsx`: 472 lines
- `components/admin/teacher-data-table.tsx`: 471 lines

## Architecture

### 1. Authentication and Access Control

Relevant files:

- `lib/auth.ts`
- `proxy.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/admin/layout.tsx`
- `app/teacher/layout.tsx`

Behavior:

- NextAuth uses a credentials provider with an explicit `loginAs` role selector.
- Admin login checks the `admins` table.
- Teacher login checks `staff_accounts`.
- Session strategy is JWT-based.
- Route protection is enforced both in `proxy.ts` and again in the admin/teacher layouts.

Assessment:

- The basic access-control flow is clear and reasonably structured.
- Session handling is centralized in `lib/auth.ts`.
- Middleware/header-based pathname propagation is used to allow login pages through layout checks.

### 2. Data Layer

Relevant files:

- `lib/db.ts`
- `lib/supabase.ts`
- `app/admin/actions.ts`
- `app/teacher/actions.ts`

Behavior:

- `lib/supabase.ts` creates an anon client for public/client-facing reads.
- `lib/db.ts` creates a service-role Supabase client for server-side reads and writes.
- `lib/db.ts` also acts as the main query/service layer for dashboards, teachers, notices, news, blogs, events, and teacher profile sections.
- `app/admin/actions.ts` contains the bulk of mutation logic for admin CRUD flows.
- `app/teacher/actions.ts` contains teacher self-service mutations.

Assessment:

- The data access layer is functional but heavily centralized.
- `lib/db.ts` and `app/admin/actions.ts` are already large enough to be maintenance bottlenecks.
- There is explicit fallback handling for missing tables/columns in multiple places, which suggests active schema drift management.

### 3. Public Site

Relevant files:

- `app/(public)/page.tsx`
- `app/(public)/teachers/page.tsx`
- `app/(public)/teachers/[id]/page.tsx`
- `app/(public)/notices/page.tsx`
- `app/(public)/news/page.tsx`
- `app/(public)/blogs/page.tsx`
- `app/(public)/events/page.tsx`

Behavior:

- Public pages mostly read directly from Supabase using the anon client.
- The home page is a large client component with animated sections and client-side data fetching.
- Teacher/staff directory and notice/news/blog/event pages are implemented.
- Contact, FAQ, gallery, policies, admission, results, and about pages are largely presentation pages.

Assessment:

- Public coverage is broad.
- The public pages depend strongly on correct Supabase table permissions and RLS behavior.
- The homepage is visually substantial but oversized and tightly coupled.

### 4. Admin Portal

Relevant files:

- `app/admin/dashboard/page.tsx`
- `components/section-cards.tsx`
- `components/chart-area-interactive.tsx`
- `app/admin/teachers/page.tsx`
- `components/admin/teacher-data-table.tsx`
- `app/admin/notices/page.tsx`
- `components/admin/notice-data-table.tsx`
- `components/admin/notice-category-data-table.tsx`

Behavior:

- Teacher management is implemented.
- Notice, news, blog, and category management are implemented.
- Event and non-teaching staff admin pages are placeholders.
- Dashboard visuals are mock-driven rather than backed by real metrics.

Assessment:

- Admin CRUD coverage is uneven.
- Content modules are much further along than the dashboard and some HR/admin screens.

### 5. Teacher Portal

Relevant files:

- `app/teacher/dashboard/page.tsx`
- `app/teacher/profile/page.tsx`
- `app/teacher/academics/page.tsx`
- `app/teacher/experience/page.tsx`
- `app/teacher/training/page.tsx`
- `app/teacher/family/page.tsx`
- `app/teacher/settings/page.tsx`
- `app/teacher/actions.ts`

Behavior:

- Teachers can log in and update profile, academics, experience, training, family entries, email, and password.
- Teacher file uploads use Cloudflare R2 via `lib/r2.ts` and the authenticated upload flow.

Assessment:

- Teacher flows are more complete than they first appear from the README.
- The portal is functional and uses authenticated server-side mutations appropriately.

## Database and Migrations

Relevant files:

- `migrations/001_rls_policies.sql`
- `migrations/002_create_notices_table.sql`
- `migrations/003_create_notice_categories.sql`
- `migrations/004_harden_notice_category_consistency.sql`
- `migrations/005_create_news_and_blogs_tables.sql`

Observed schema used by application code:

- `admins`
- `staffs`
- `staff_accounts`
- `staff_academics`
- `staff_experience`
- `staff_training`
- `staff_family`
- `notices`
- `notice_categories`
- `news_posts`
- `news_categories`
- `blog_posts`
- `blog_categories`
- `events`
- `audit_logs`

Important mismatch:

- `migrations/001_rls_policies.sql` is written for tables such as `teachers`, `staff`, `teacher_academics`, `teacher_experience`, `teacher_training`, and `teacher_family`.
- The current application code uses `staffs`, `staff_academics`, `staff_experience`, `staff_training`, and `staff_family`.

Assessment:

- The notices/news/blog migrations align with the current code direction.
- The RLS migration does not align with the live table names used by the app and should be treated as stale until reconciled.

## Validation Status

Command run:

- `npm run lint`

Result:

- Failed with 7 errors and 10 warnings.

Main failures:

- `components/forms/tiptap-editor.tsx`
  - React lint error for calling `setState` synchronously inside an effect.
- `scripts/seed-admin.js`
  - CommonJS `require()` imports violate the current ESLint rules.
- `scripts/reset-admin-password.js`
  - CommonJS `require()` imports violate the current ESLint rules.

Warnings include:

- unused imports/values in `components/admin/teacher-data-table.tsx`
- unused imports and `<img>` usage in `components/login-form.tsx`
- unused variable in `scripts/seed-admin.ts`

## Main Findings

### 1. Stale security migration

Severity: high

`migrations/001_rls_policies.sql` does not match the actual table names used in the application. If someone deploys this migration assuming it secures the current schema, they will not get the intended protections.

### 2. Admin dashboard is mostly mock data

Severity: medium

`app/admin/dashboard/page.tsx`, `components/section-cards.tsx`, and `components/chart-area-interactive.tsx` use static JSON and mock arrays instead of live metrics, even though `lib/db.ts` already exposes `getAdminDashboardMetrics()`.

### 3. Some admin sections are placeholders

Severity: medium

`app/admin/events/page.tsx` and `app/admin/staffs/page.tsx` are not wired into the CRUD/actions layer yet. The sidebar suggests broader functionality than currently exists.

### 4. Public data visibility relies on database policy correctness

Severity: medium

Public-facing pages query notices, events, teachers, and other data via the anon Supabase client. This is acceptable only if Supabase permissions and RLS are correct. Because the primary RLS migration is stale, this deserves explicit review before production.

### 5. Contact form is still a mock

Severity: low

`app/(public)/contact/ContactForm.tsx` simulates submission with a timeout and does not persist or send anything.

### 6. Repository contains a public test page

Severity: low

`app/test/page.tsx` still exists and logs `staffs` data to the browser console. This should usually be removed or gated before release.

### 7. Encoding/artifact issues exist in some files

Severity: low

Several files contain mojibake or malformed characters in strings/comments, especially:

- `README.md`
- `app/(public)/page.tsx`
- `app/(public)/contact/ContactForm.tsx`
- script files with console output

This does not always break runtime behavior, but it degrades polish and may signal inconsistent file encoding.

## Notable Strengths

- Clear separation between public site, admin portal, and teacher portal.
- Authentication flow is understandable and consistently reused.
- Teacher portal mutations are server-side and role-guarded.
- Notice/news/blog categories include normalization and migration support.
- Upload support exists for both R2 and Supabase Storage.
- Security headers are set in `next.config.ts`.

## Recommended Next Steps

1. Reconcile database migrations with the real schema, starting with RLS and table naming.
2. Fix the current lint errors so the repo returns to a clean baseline.
3. Replace admin dashboard mock data with real metrics from `lib/db.ts`.
4. Either implement or explicitly mark incomplete admin modules such as staff and events management.
5. Remove or protect `app/test/page.tsx`.
6. Replace the mock contact form with a real server action or API endpoint.
7. Split `app/admin/actions.ts` and `lib/db.ts` into smaller domain modules before they grow further.

## Workspace Note

The working tree was already dirty before this report was added. Existing modified files were not changed as part of this report:

- `app/admin/actions.ts`
- `app/admin/teachers/page.tsx`
- `components/app-sidebar.tsx`
- `lib/db.ts`
- `components/admin/teacher-data-table.tsx`
