Add a floating control bar for zooming and redo/undo, then wire the same actions to keyboard shortcuts

## Implementation

1. Add a pill-shaped control bar at the bottom left of the canvas
    - It should sit above the shape toolbar, and include:
        - zoom controls: zoom-in, fit-view, zoom-out
        - history controls: undo, redo
    Separate 2 groups with a thin separator.

2. Wire the zoom control to the ReactFlow instance.
    - zoom in
    - zoom out
    - fit view
    - use a short animation so the movement feels smooth

3. Wire undo and redo to the Liveblocks history
    - use the exisiting undo/redo hooks.
    - disable undo when there is nothing to undo
    - disable redo when there is nothing to redo
    - keep disabled button visually dimmed

4. Create a `useKeyboardShortcuts` hook in `hooks/`

    The hook should:
        - Receive the React Flow instance
        - receive undo/redo handlers.
        - listen for keyboard shortcuts on `window`
        - ignore the shortcut while typing

5. Support these shortcuts:
- `Ctrl + +/-` for zooming in an out
- `Ctrl + Z` to undo
- `Ctrl + Y` to redo

6. Remove the minimap at the bottom right of the canvas

## Scope Limits
- Don't change shape panel
- Don't change node or edge rendering
- Don't add extra canvas controls
- Don't change the existing collaborative canvas set up

## Check when done
- Control bar is added at the bottom left of the canvas
- Zoom actions use the React Flow instance.
- Undo and Redo use the Liveblocks history.
- Keyboard shortcuts are handled in `hooks/useKeyboardShortcuts`
- Shortcut handling is skipped when inputing/typing
- `npm run build` passes
