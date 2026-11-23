Set up backend flow for design generation using Trigger.dev
This unit handles triggering background jobs, tracking runs, and issuing tokens. No AI logics yet.


## Implementation

1. Add the design trigger route
Add `POST app/api/ai`:
- receive the design prompt and required context (`roomID`, `projectID`)
- Trigger the design task in Trigger.dev
- create TaskRun record
- return the run ID to the client

2. Add task run tracking
    Create a `TaskRun` model in Prisma to track Trigger.dev run and ownership

    It should include:
    - `runID` (unique)
    - `projectID`
    - `userID`
    - `createdAt`

    Add:
    - an index on `runId`
    - a compound index on `userId` and `projectId`

3. Create a token route
    Create `POST /api/ai/design/token`
    This route should:
    - accept a run ID
    - verify ownership using the TaskRun record
    - generate a Trigger.dev public token scoped to that run
    - return the token to the client

4. Create the design task
    Create `trigger/design-agent.ts`
    - Check the existing Trigger.dev set up and installed agent feature first
    - Use the existing setup instead of creating a new pattern
    - Export a minimal design task
    - Accept the expected payload (`prompt`, `roomID`)
    - log or echo the input for now
    - don't add AI logic yet

## Scope Limits
- Don't generate nodes or edges yet
- Don't call any API yet    
- Don't update the canvas yet
- Keep this focused on handling the backend task wiring only

## Check when done
- `POST /api/ai/design` triggers a background tasks, return the runID
- Task runs are stored in Prisma
- `POST /api/ai/design/token` reutrn the token
- Design task exists and is callable
- `npm run build` passes

