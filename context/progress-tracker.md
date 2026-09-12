# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Phase 2: Editor Chrome — complete

## Current Goal

- [Next feature spec]

## Completed

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

- shadcn canary used (not stable) because Tailwind v4 support requires it
- Dark-only theme: all color values set in :root (no light/dark toggle); `dark` class
  on `<html>` activates shadcn's `@custom-variant dark` for component dark: variants
- lib/utils.ts uses the `cn` package (shadcn's lightweight utility) rather than clsx + tailwind-merge

## Session Notes

- Next.js 16.3.3 + React 19 + Tailwind CSS v4 (CSS-first config, no tailwind.config.js)
- components/ui/* are generated — do not modify per spec
