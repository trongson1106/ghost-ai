Add a small colour picking toolbar when a node is selected, which can change both the background colour and the text colour directly on the canvas

## Implementation
1. Check `ui-context.md` for the node colour pallete.
Reuse the colour if they already exists in global.css. Otherwise, keep the pallete in the canvas types/constants.

2. Add a toolbar above the selected node
- When a node is selected, show the toolbar above it, without overlapping with the node
- Show one swatch per colour pair
- Active swatch should feel clearly selected
- Hovering a swatch shows a subtle glow based on its text colour
- Keep the glow tight and controlled, not overly blurred
- Prevent toolbar action when dragging nodes or panning the canvas

3. When a swatch is selected:
- Update both the node's background and the text colour
- Update the node's UI immediately
- Keep this inside the existing collaborative canvas state
- No server call

## Scope Limit
- Don't change drag/drop action, don't rebuild shape selection logic, just focus on the colour picking and update the colour of the node.
- Don't add a full colour picker.

## Check when done
- Nodes use predefined background/text colour pallete
- Selected node shows a floating colour toolbar above
- Swatch selection updates both node's background and text colour
- `npm run build` passes
