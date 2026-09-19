# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Phase 4: Project Dialogs — complete

## Current Goal

- [Next feature spec]

## Completed

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
