The Prisma database schema is ready. Build the backend project API routes only.

## Routes

Create REST endpoints for:
- `GET /api/projects`: list current user's projects
- `POST /api/projects`: create project
- `PATCH /api/projects/[projectID]`: rename project
- `DELETE /api/projects/[projectID]`: delete project

## Rules

Use the authentication ID from Clerk as the `ownerId`

When creating:
- default missing project name: `Untitled Project`
- use the schema's existing ID stratergy, without add sequential IDs.

Security:

- unauthenticated request returns `401`
- only project's owner can rename or delete the project
- non-owner mutations returns `403`

Keep this backend-only. Do not wire the UI yet.

## Check when done
- routes exist for list/create/rename/delete
- owner checks are enforced for rename/delete
- `401` and `403` responses are handled correctly
- `npm run build` passes
