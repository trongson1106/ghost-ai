Replace the canvas placeholder with a Liveblock-based canvas with React Flow

## Implementation

1. Keep the workspace page server-side 

2. Create a client-side editor/canvas wrapper that sets up the Liveblocks room.
    It should include:
    - `LiveblocksProvider` using `api/liveblocks-auth`
    - `RoomProvider` using the current room ID
    - initial presence with `cursor: null`
    - `ClientSideSuspense` with a simple loading state
    - an error fallback for Liveblocks connection issues

3. Wire React Flow to Liveblocks state.
    - use `useLiveblocksFlow`
    - enable suspense
    - start with an empty nodes and edges 
    - pass the synced nodes, edges, and change handlers into `ReactFlow`

4. Add shared canvas type in `types/canvas.ts`
    Node data could support:
    - label
    - colour
    - shape

    Also define the custome node and edge types:
    - `canvasNode`
    - `canvasEdge`

5. Render a basic canvas
    Include:
    - loose connection behaviour
    - `fitView`
    - `MiniMap`
    - dot-pattern background

## Scope Limits

- don't add controls yet
- don't add custom node or edge rendering yet
- don't add persistence logic
- don't add AI behaviour
- keep this focused on the collaborative canvas foundation.

## Check when done
- Client canvas wrapper sets up the Liveblock room
- ReactFlow uses the Liveblock-synced nodes and edges
- Shared canvas types exists in `types/canvas.ts`
- `npm run build` passes.
