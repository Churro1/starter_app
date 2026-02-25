# Next.js + Supabase Starter App

Reusable starter app for Next.js App Router + Supabase with authentication, protected routes, profile management, and secure database policies.

## Purpose

This project is designed as a base template for future apps that need:

- Email/password authentication
- Server and browser Supabase clients
- Protected routes
- Profiles table with RLS
- Automatic profile creation from `auth.users`
- Repeatable local setup

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (required by local Supabase)
- Supabase CLI available via `npx supabase ...`

## Quick Start (Recommended)

```bash
npm run setup
npm run dev
```

Then open `http://localhost:3000`.

## Manual Setup

```bash
npm install
npx supabase start
npx supabase status -o env
```

Copy values into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Apply migrations:

```bash
npx supabase db reset
```

Start app:

```bash
npm run dev
```

## Setup Script

`setup.js` automates:

1. `npm install`
2. `npx supabase start`
3. credential extraction from `npx supabase status -o env`
4. `.env.local` creation/update
5. `npx supabase db reset`

It is idempotent and safe to re-run.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

For production CI migration runs:

- `SUPABASE_DB_URL` (GitHub secret)

## Project Structure

- `app/` App Router pages (`/`, `/login`, `/signup`, `/dashboard`, `/profile`)
- `components/` Reusable UI building blocks (`AuthStatus`, `ProfileForm`, `SignOutButton`)
- `hooks/` Client hooks (`useAuth`)
- `lib/supabase/` Supabase SSR/browser/middleware utilities
- `lib/auth/` Reusable server auth helpers
- `supabase/schemas/` Declarative SQL schema source
- `supabase/migrations/` Versioned DB migrations

## Database Schema Overview

`profiles` table:

- `id uuid` primary key references `auth.users(id)`
- `email text not null`
- `full_name text`
- `avatar_url text`
- `updated_at timestamptz not null`

Migrations include:

- automatic profile creation trigger on `auth.users`
- `updated_at` trigger before profile updates
- RLS policies for own-row `select`, `insert`, and `update`
- `avatars` storage bucket and object policies

## Authentication Flow

1. User signs up or logs in (`/signup`, `/login`).
2. Supabase session cookies are refreshed in `middleware.ts`.
3. Protected routes (`/dashboard`, `/profile`) call `requireUser()`.
4. On signup, DB trigger creates a matching `profiles` row.
5. Profile updates and avatar uploads are restricted by RLS/storage policies.

## Reusable Auth Patterns

- Client components: `useAuth()` for auth state subscription.
- Server components: `getCurrentUser()` and `requireUser()` helpers.
- Sign out: reusable `SignOutButton` client component.

## Routes Included

- `/` home page with auth status and navigation
- `/login` email/password login with error handling
- `/signup` email/password signup with error handling
- `/dashboard` protected page with profile summary + sign out
- `/profile` protected page with profile update + avatar upload

## Testing

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Included example tests demonstrate:

- utility testing (`lib/utils/strings.test.ts`)
- auth utility testing (`lib/auth/utils.test.ts`)
- React component testing (`components/auth-status.test.tsx`)

## Deployment (Example: Vercel)

1. Create a production Supabase project.
2. In Vercel, set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy Next.js app.
4. Ensure production DB has applied migrations.

## GitHub Actions: Production Migrations

Workflow: `.github/workflows/supabase-migrations.yml`

- Trigger: push to `main`
- Action: runs `supabase db push --db-url "$SUPABASE_DB_URL"`
- Secret required: `SUPABASE_DB_URL`

## Troubleshooting

- If local Supabase will not start, confirm Docker is running.
- If auth fails, check `.env.local` credentials and restart dev server.
- If profile updates fail, run `npx supabase db reset` to reapply migrations.
- If avatar uploads fail, verify storage policies and authenticated session.

## Using This Starter for New Projects

1. Copy this repository.
2. Run `npm run setup`.
3. Replace route UI/components while keeping auth/db foundation.
4. Add new migrations for domain-specific models.

## Pre-Submission Checklist

1. `npm run setup` completes on a clean clone
2. auth and protected routes work locally
3. profile updates and avatar upload work
4. migrations are committed
5. remove `node_modules` before submission
