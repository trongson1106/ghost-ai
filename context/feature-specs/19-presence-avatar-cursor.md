Show active room participants inside the canvas editor view, without changing the editor home navbar

## Implementation
1. Keep the existing navbar behaviour as-is
    - Do not change the editor home navbar
    - Do not move or redesign the shared navbar componenet globally
    - If the editor home and editor canvas have the same navbar component, make sure this presence UI only appear in the 
    canvas/editor room view.

2. Add the participant avatar group inside the editor canvas area.
   - position it in the top-right corner of the editor canvas view
   - keep it visually separate from the main navbar actions
   - get the current user's ID from the active Clerk session
   - filter the Liveblocks presence list to exclude any entry
     whose user ID matches the current Clerk user ID
   - render the filtered list as collaborator avatars only
   - render the current user separately using the existing Clerk
     UserButton — do not render a second avatar for them from
     the Liveblocks presence list
   - keep collaborator avatars and the Clerk UserButton the same
     size so the group looks visually consistent
   - collaborator avatars are display-only, not interactive
   - show a divider between the collaborator avatars and the
     Clerk UserButton only when at least one collaborator exists
   - if no collaborators are present, show only the Clerk
     UserButton with no divider

3. Render collaborator avatars.
   - use profile photos when available
   - fall back to initials when there is no image
   - show up to five collaborator avatars in an overlapping stack
   - show a +N overflow chip when there are more than five
   - add a subtle ring so avatars stay readable on the dark canvas

4. Add live cursors to the canvas.
   - render cursors for other participants only, never the
     current user
   - use the existing Liveblocks presence state to broadcast
     cursor position
   - update cursor position on React Flow's onMouseMove event
   - clear cursor to null on mouse leave
   - show a small colored pointer with a name badge attached
   - match the pointer and badge color to the participant's
     presence color

5. Define the shared presence type in `liveblocks.config.ts`.

   Presence should include:
   - `cursor`: `{ x: number; y: number } | null`
   - `thinking`: boolean

## Scope Limits
- don't add AI Feature
- don't change any existing functions, including the controls navigation bar, canvas editor, drag and drop,....
- Just focus on collaborators list and cursor

## Check when done
- The collaborators are shown correctly in the lists at the top right of the canvas editor
- Live cursors are added correctly to the canvas, one should see what others are doing with separate colours and names attached to the mouse
- Any existing behaviour stays untoched
- `npm run build` passes


