We need the base chrome components that frame every editor screen - the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows.

### Editor Navbar

Create `components/editor/editor-navbar.tsx`

Requirements:
- Fixed height top navbar
- left, center, and right section
- left section contains sidebar toggle button
- use `PanelLeftOpen` / `PanelLeftClose` icons based on the sidebar state
- right section stays empty for now
- dark background with subtle bottom border

### Project sidebar
Create `components/editor/project-sidebar.tsx`

Requirements:
- Sidebar float above the editor screen
- Open it should not push page content
- Slides in from the left
- acceprs `isOpen` prop.
- Header with `Projects` title + close button
- shadcn `Tabs`:
    - My Projects
    - Shared
- both tabs show empty placeholder state
- full-width `New Project` button at the bottom with the `Plus` icon

### Dialog Pattern

Use the existing color tokens from `globals.css` for styling

Support:
- Title
- Description
- Footer actions

Do not build actual dialogs yet.

### Check when done

- new components compile without TypeScript errors.
- no lint errors
- dialog pattern is ready for future use
