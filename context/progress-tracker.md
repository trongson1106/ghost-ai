# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Phase 7: Wire editor home to real project APIs — complete

## Current Goal

- [Next feature spec]

## Completed

- Wire editor home + dialogs to real project APIs (spec: context/feature-specs/07-wire-editor-home.md)
  - `lib/projects.ts` — `getOwnedProjects(userId)` and `getSharedProjects(userEmail)` server-side helpers using Prisma selects
  - `hooks/use-project-actions.ts` — replaces mock `use-project-dialogs`; manages dialog state + all mutations; create calls `POST /api/projects` then navigates to `/editor/{project.id}`; rename calls `PATCH` then `router.refresh()`; delete calls `DELETE` then redirects to `/editor` if active workspace else refreshes; room ID preview = `{slug}-{4-char-suffix}` generated on dialog open
  - `components/editor/editor-home.tsx` — new `"use client"` wrapper that receives server-fetched project lists as props and wires `useProjectActions` to the sidebar and dialogs
  - `app/editor/page.tsx` — converted to async server component; fetches owned projects via `getOwnedProjects` and shared projects via `getSharedProjects` (using `currentUser()` email) in parallel; passes `ProjectSummary[]` to `EditorHome`
  - `components/editor/project-sidebar.tsx` — props changed to `ownedProjects`/`sharedProjects: ProjectSummary[]`; no longer filters client-side
  - `components/editor/dialogs/create-project-dialog.tsx` — `slug` prop renamed to `roomId`; label updated to "Room ID:"
  - `components/editor/dialogs/rename-project-dialog.tsx` and `delete-project-dialog.tsx` — updated to `ProjectSummary` type
  - `types/project.ts` — `Project` interface replaced by `ProjectSummary` (removed `slug`, kept `id`, `name`, `owned`)
- Project API routes (spec: context/feature-specs/06-project-apis.md)
  - `app/api/projects/route.ts` — `GET` lists the authenticated user's projects ordered by `createdAt` desc; `POST` creates a project (defaults name to `Untitled Project`); both return `401` for unauthenticated requests
  - `app/api/projects/[projectID]/route.ts` — `PATCH` renames a project; `DELETE` deletes a project; both return `401` for unauthenticated requests and `403` when the caller is not the owner
  - `lib/prisma.ts` — fixed `makeClient` return type to `PrismaClient` (cast Accelerate-extended client via `as unknown as PrismaClient`) to resolve union-type TS2349 error
- Prisma data models + client (spec: context/feature-specs/05-prisma.md)
  - `prisma/models/project.prisma` — `Project` (ownerId, name, description, status enum DRAFT/ARCHIVED, canvasJsonPath, timestamps; indexes on ownerId and createdAt) + `ProjectCollaborator` (project cascade, email, createdAt; unique [projectId,email]; indexes on email and [projectId,createdAt])
  - `prisma.config.ts` — updated to `schema: 'prisma'` (multi-file), `migrations.path`, `env()` helper, `dotenv/config`
  - `lib/prisma.ts` — cached global singleton; branches on `prisma+postgres://` → Accelerate (`withAccelerate`), otherwise → `PrismaPg` direct adapter
  - Migration `20260925202706_init` applied; client regenerated to `app/generated/prisma`
  - `@prisma/extension-accelerate` installed
- Editor home + project dialogs (spec: context/feature-specs/04-project-dialogs.md)
  - `app/editor/page.tsx` — home screen with title/description/New Project button; all three dialogs rendered and wired
  - `hooks/use-project-dialogs.ts` — manages dialog state, form state (with live slug), loading state, and mock project list
  - `types/project.ts` — `Project` interface
  - `components/editor/dialogs/create-project-dialog.tsx` — name input + live slug preview
  - `components/editor/dialogs/rename-project-dialog.tsx` — prefilled input, auto-focused, Enter submits
  - `components/editor/dialogs/delete-project-dialog.tsx` — destructive confirmation, no input
  - `components/editor/project-sidebar.tsx` — project items with hover rename/delete actions for owned projects; mobile backdrop that closes on tap
- Auth wiring (spec: context/feature-specs/03-auth.md)
  - `proxy.ts` — clerkMiddleware exported as `proxy` (Next.js 16 convention); protects all routes except `/sign-in` and `/sign-up`
  - `app/layout.tsx` — `ClerkProvider` wraps root layout; dark theme from `@clerk/ui/themes` + CSS variable overrides (no hardcoded colors)
  - `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (lg+: logo/tagline/features left, Clerk form right; mobile: form only)
  - `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout as sign-in
  - `app/page.tsx` — redirects authenticated → `/editor`, unauthenticated → `/sign-in`
  - `app/editor/page.tsx` — placeholder editor shell rendering existing navbar + sidebar components
  - `components/editor/editor-navbar.tsx` — `UserButton` added to right section
  - `.env.local` — `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` added
  - `@clerk/ui` installed
- Editor chrome (spec: context/feature-specs/02-editor.md)
  - `components/editor/editor-navbar.tsx` — fixed-height navbar, sidebar toggle (PanelLeftOpen/Close), dark bg + bottom border
  - `components/editor/project-sidebar.tsx` — floating overlay sidebar, slides in from left, Projects title + close, My Projects/Shared tabs with empty states, New Project button
  - Dialog pattern ready via existing `components/ui/dialog.tsx` + globals.css tokens
- Design system setup (spec: context/feature-specs/01-design-system.md)
  - shadcn/ui (canary) installed and initialized for Tailwind v4
  - Components added: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - lucide-react installed
  - lib/utils.ts exports cn() from the `cn` package
  - Dark theme CSS variables defined in globals.css (--bg-base, --bg-surface, etc.)
  - shadcn semantic tokens (--background, --foreground, etc.) mapped to project dark theme
  - Project design tokens exposed as Tailwind utilities via @theme inline
  - `<html>` has `dark` class so shadcn dark: variants are always active
  - `npm run build` passes

## In Progress

- None yet.

## Next Up

- [Next feature spec]

## Open Questions

- [Any unresolved product or technical decisions]

## Architecture Decisions

- `lib/prisma.ts` `makeClient` must have an explicit `: PrismaClient` return type; `withAccelerate()` produces an extended type incompatible with the non-Accelerate branch — cast with `as unknown as PrismaClient` to get a usable union-free type
- `prisma.config.ts` `schema` field accepts a folder path; Prisma 7 recursively finds all `*.prisma` files — enables multi-file schema without preview flags
- Accelerate URLs (`prisma+postgres://`) must NOT be passed to driver adapters — use `accelerateUrl` constructor option + `withAccelerate()` extension
- `lib/prisma.ts` caches the client on `globalThis` in non-production to survive hot reloads; production always creates a fresh instance per module evaluation
- Next.js 16 renames `middleware.ts` → `proxy.ts`; the exported function must be named `proxy` not `middleware`
- Clerk v7 `createRouteMatcher` is deprecated; public route check is done manually by pathname prefix in the proxy handler
- `@clerk/ui` (not `@clerk/themes`) is the correct package for the dark theme in Clerk v7+
- shadcn canary used (not stable) because Tailwind v4 support requires it
- Dark-only theme: all color values set in :root (no light/dark toggle); `dark` class
  on `<html>` activates shadcn's `@custom-variant dark` for component dark: variants
- lib/utils.ts uses the `cn` package (shadcn's lightweight utility) rather than clsx + tailwind-merge

## Session Notes

- Next.js 16.3.3 + React 19 + Tailwind CSS v4 (CSS-first config, no tailwind.config.js)
- components/ui/* are generated — do not modify per spec
