Set up the realtime collaboration infrastructure

## Configuration

Configure the `liveblocks.config.ts` at the root

Define:

### Presence

- cursor positioning
- `isThinking` boolean

### User Metadata

- user ID
- display name
- avatar URL
- cursor color

## Liveblocks Client

Create a cached Liveblocks node client in `lib`.

Add a helper that deterministically maps a user ID to a consistent colour from a fixed palette.

## Auth Route 

Create `POST /api/liveblocks-auth`.

Use the project ID as the Liveblocks room ID.

This route must:

1. Require Clerk authentication
2. verify project access using the existing access helper
3. ensure the Liveblocks room exists (create only if needed)
4. return a session token with:
    - username
    - avatar
    - generated cursor color


Return `403` for unauthorized project access.