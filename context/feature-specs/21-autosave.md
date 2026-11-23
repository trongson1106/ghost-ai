Add autosave and load for the canvas, make sure it's persistent before adding AI Generation feature. Canvas JSON should be stored in the Vercel Blob storage, the saved Blob URL is saved in Prisma project record.

## What to Install
- `@vercel/blob`

## Implementation
1. Check the exisiting project schema
- review `model.prisma`
- Create or reuse a field for Blob URL
- Keep Prisma responsible for metadata only, no Image, no JSON.

2. Add canvas save/load API route
- Add `PUT app/api/projects/[projectID]/canvas`
This route should:
    - Receive the latest canvas JSON
    - Store the JSON on Vercel Blob
    - store the corresponding URL to the corresponding Prisma project.

- Add `GET app/api/projects/[projectID]/canvas`
This route should
    - Get the Blob URL of the project
    - Fetch the JSON taken from the Blob URL
    - Display the canvas state from the JSON

3. Add an autosave hook in the `/hook` folder
- watch the canvas nodes and edges
- debounce saves to avoid excessive write
- save throught the `canvas` API written above
- track the save status: Saving, Saved, Error

4. Load saved canvas state in the editor
- when the editor loads, check if the Liveblocks room has any existing nodes/edges
- If the room has no node or edge, but has a Blob URL, fetch and load the JSON to the editor
- If the room has edge/node, skip this loading stage, avoid overwriting active collaborators

5. Add a small saving status of the canvas in the `Save` button

## Storage Pattern
- Prisma store metadata, and the Blob URL only
- Vercel Blob store the acutal canvas JSON

## Check when done
- There is a field in the Prisma model to store the Blob URL
- Two `canvas` routes function properly
- Autosave hook is added and intergrated properly, using debounce save
- Loading canvas to editor function porperly depending on the state of the room
- UI display of the saving status.
- `npm run build` passes.
