Implement full AI design agent so a user prompt results in real-time updated on the collaborative canvas, with visible AI presence status

## Implementation
1. Update the `design-agent.ts` to fully implement the design task
    Before implementing:
    - Check `context/project-overview.md` and `context/architecture.md` for product behaviour and system rules
    - Before implementing, check Liveblocks and Trigger.dev agent skills for current patterns on canvas mutation and background task execution
    - Follow the existing Trigger.dev setup and agent patterns already in the project
    - Reuse the existing Liveblocks instead of creating new pattern.

    Then implement:
    - Use Gemini (`@ai-sdk/google`) to interpret the user prompt
    - Update the canvas using the existing collaborative flow utilities
    - Support actions like:
        - Add nodes
        - Move nodes
        - Resize nodes
        - Update the node data
        - Delete node

    - Publish AI activity to the shared status feed so all users see the progress
    - update AI presence (cursor + thinking state) while the task is running
    - push clear status message at key steps: start, processing, complete

    - ensure generated designs follow:
        - allowed node shapes
        - color pallete
        - layout and spacing rules

    - Handle errors gracefully and update if anything failed
    - Clear AI presence when finished

## Dependencies
    - `GEMINI_API_KEY` is already in the .env.local
    - All packages are installed and set up successfully

## Scope Limit
- Don't change the canvas architecture
- Don't introduce new state system outside Liveblocks
- Remain the maunal behaviour, add the AI behaviour based on the exisiting one


## Check when done
- `design-agent.ts` is implemented completely, containing calling Google Gemini API through Trigger.dev and display the AI's updates properly on the collaborative canvas
- `npm run build` passes

