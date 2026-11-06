Make the nodes can be resize and can be wired up to other nodes. The node body can be edited for labeling.

## Implementation

1. Resize the shape
- Turn the edges and corners of the nodes to be the adjusting place, where we can resize it by clicking, then hold, the pull the mouse at the point.
- Show the resizing signs (from edges and corners) when the nodes are hovered. Otherwise, keep the nodes unchanged.

2. Wiring nodes
- Add 4 points on each node (just show when hover on)
- Users can drag the point, crate a line, and connect it the the node that users drop on. Otherwise, if one end of the line is not dropped on a node, cancel the wiring action.

3. Enable label editing
- When double click on a node, show a text editing, which can be typed on.
- Keep the editing remaining center of the shape, and the label after being typed also at the center of the shape
- When click `Enter`, exit the typing state. `Shift + Enter` to go to the new line.

## Check when done
- the shape is resizable
- nodes can be wired up properly
- Labels can be input by double click
- `npm run build` passes


