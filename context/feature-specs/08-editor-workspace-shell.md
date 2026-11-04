Build the `editor/[roomID]` workspace shell with server-side access check. No canvas logic yet.

## Access

`/editor/[roomID]` must be a server component

Before rendering:

- unauthenticated users are redirected to `/sign-in`
- users without project access see `AccessDenied`
- non-existent projects also show `AccessDenied`

Create `components/editor/access-denied.tsx` with:

- centered layout
- lock icon
- short message
- button linked back to `/editor`

## Access Helpers

Create `lib/project-access.ts` with helpers for:

- getting current Clerk identity: `userID` + primary email
- checking access by owner or collaborator(s).

## Layout

Build a full-viewport workspace with:
- top navbar showing the project's name
- navbar actions: share project button and AI sidebar toggle on the right side of the navbar
- exisiting `ProjectSidebar` on the left, current accessed project highlighted in the sidebar
- central canvas placeholder with dark background and centered message
- right sidebar placeholder for AI chat.

The canvas area should fill the remaining space

## Scope

Do not add real canvas logic: AI chat, Liveblocks, sharing behaviour yet

## Check when done

- `editor/[roomID]` builds successfully
- access helpers exist outside the page component
- `AccessDenied` is used for missing or unauthorized project
- workspace layout renders with current project context
- no Typescript error
- `npm run build` runs successfully.



