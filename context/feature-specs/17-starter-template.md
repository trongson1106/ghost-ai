Add a small starter template library so users can start a canvas from a pre-built diagram, not from scratch.

1. Add a starter template library dialog when a new workspace/canvas is created, so user can pick from them
- Include at least 3 templates, such as microservices, CI/CD, and event-driven system
- Show template cards as scrollable grid
- Include the `Start from Scratch` card as the first element of the library.

2. In each card:
- Show the image/preview of the template, fit the card, keep the preview light. Calculate the preview bounds from the template node positions.
- Show the template's name and description
- When the card is hoverd, show the `Import` button right below it.
- If `Import` is clicked, import that template to the collaborative canvas, then close the dialog.

## Check when done
- The dialog is opened when a project is created
- The selected template should be imported to the canvas properly, drawn using the existing nodes.
- `npm run build` passes



