Add a floating bottom shape panel, users can drag and drop shapes onto the canvas and create new nodes.

## Implementation

1. Add a floating pill-shaped tool bar at the bottom-center of the canvas

2. Add draggable icon buttons of these shapes:
    - Rectangle
    - Diamond
    - Circle
    - Pill
    - Cylinder
    - Hexagon

3. When dragging a shape, include the shape name and default size in the drag payload.
    Use sensible shape size:
    - Rectangles should be wide
    - Circles should be squares
    - Diamonds should be slightly larger so lables have room.

4. Add `dragover` and `drop` handling to the canvas wrapper

5. On drop:
    - read the dragged shape payload
    - convert screen position to canvas coordinate using React Flow
    - Create a new node at that position
    - use an empty label
    - use the default node colour
    - use the dragged shape value

6. Generate each node ID using the shape name, timestamp, and a counter

7. Add a basic renderer for the custom canvas node type so new nodes are visible

    For this unit, return every shape as a simple bordered rectangle with the label centered,
    Shape-specific visuals will be added later

## Check when done
- Shape drag payload includes correct shape and size data
- Drop logic creates new canvas nodes with the expected shape data.
- New nodes use the custom canvas node type.
- `npm run build` passes without type errors.
