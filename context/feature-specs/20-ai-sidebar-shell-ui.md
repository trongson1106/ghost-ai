Complete the AI chat placeholder, make it into a real chat sidebar component. The sidebar is already exists. Focus on building the UI only.

## Implementation

1. Add smooth slide in effect/animation for the sidebar when the `AI Assistant` icon on the navbar is clicked.

2. Add 2 tabs for this sidebar.
Use `Tabs` in shadcn:
    - `AI Architect`
    - `Spec`
    - Active tab should use accent styling
    - Inactive tab text should be styled muted

3. Building the `AI Architect` Tab
Use shadcn components where they fit, especially `Button` and `Textarea`
- Scrollable chat area
- User's messages are aligned to the right of the chat area
- AI's messages are aligned the the left of the chat area
- When first opend, the chat area is empty with some chat starter bubbles floating above the user's chat input like:
`Desgin an e-commerce backend`, `Create a chat app architecture`, `Build a CI/CD Pipeline` 
- Input area is auto-resizing textarea, around 72px min-height and 160px max-height
- Send button should use `bg-accent text-white`
- Press `Enter` also send the message, `Shift + Enter` to start a new line

4. Building the `Spec` tab
    - Show a `Generate Spec` button using `bg-accent text-white`
    - show a demo spec card for now
    - style the card with `bg-elevated` and `border-surface-border`
    - include a file/spec icon, title, short snippets, and disabled download action

5. Use the existing project colour tokens, check `ui-context.md` and `global.css`

## Scope Limits
- Don't add backend and AI Generation and Liveblocks logics
- Just focus on UI.

## Check when done
- The sidebar has the slide-in animation when the button is clicked
- 2 tabs are shown, one active
- In each tab, the button and/or textarea are shown properly
- `npm run build` passes
