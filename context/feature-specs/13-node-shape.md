Replace the placeholder (the rectangles) node renderer with a proper shape rendering and a drag preview

## Implementation

1. Replace the placeholder node shape rendering
    - rectangle, pill, and circle should be shaped by CSS styling
    - diamond, hexagon, cylinder should render with SVG shapes
    - SVG shapes should scale with node size
    - keep border subtle at rest and brighter when selected

2. Add a node drag preview 
    - when dragging a shape from the panel, show the ghost preview of that shape
    - keep the preview attach to the cursor while dragging
    - use the same shape size and default size that will be dropped
    - hide the preview after the shape is dropped, or the drag is cancelled
    - keep this limited to drag preview behaviour only

3. Keep node rendering connected to the existing collaborative canvas state.

## Scope Limit
- don't rebuild the shape panel layout
- don't change how dropped node are created
- don't add resize or label editing yet


## Check when done
- Nodes render the correct shape variant for each type.
- the shapes are corrected rendered from CSS and SVG
- `npm run build` passes.
