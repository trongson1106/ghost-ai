# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes, do not layer workaround
- Do not mix unrelated concerns in one
  component or route
- Respect the system boundaries defined in architecture.md

## TypeScript

- Strict mode is required throughout the project
- Avoid any — use explicit interfaces or narrowly
  scoped types
- Validate unknown external input at system
  boundaries before trusting it

## [Framework — e.g. Next.js]

- Default to server components
- Add use client only when browser
  interactivity requires it
- Keep route handlers focused on a
  single responsibility

## Styling

- Use CSS custom property tokens defined in globals.css — no
  hardcoded hex values or no raw Tailwind color classes like zinc-*
- Reference tokens through their Tailwind utility names: bg-base, text-copy-primary, border-surface-border, etc.  
- Follow the border radius scale defined
  in ui-context.md

## API Routes

- Validate and parse request input before
  any logic runs
- Enforce auth and ownership before any mutation
- Return consistent, predictable response shapes

## Data and Storage

- Metadata belongs in the database
- Large generated content belongs in file
  or blob storage
- Do not store large content directly in
  the database

## File Organization

- `lib/` — shared infrastruture: Prisma client, auth helpers, utilities
- `trigger/` — all durable background tasks and AI workflows
- `components/` — UI composition only, no business logic
- `app/api/` — route handlers for auth triggering, and persistence
- Name files after the responsibility they contain, not the technology
