## Goal

Build the `/editor` home screen and add project sidebar/dialogs action. No API call yet

## Editor Home

Reuse the exsiting editor layout. Do not modify the navbar and the sidebar behaviour.

In the center of the page, add:
- Title/Headings: `Create a project or open an existing one`
- Description: `Start a new architecture workspace, or choose a project from the sidebar
- A button `New Project` with a Plus icon

Keep the layout minimal, don't wrap elememts in cards

Clicking on the `New Project` button also open the Create Project dialog.

## Dialogs

### Create Project

- project name input
- lived slug based on the name
- preview updates as the user types

### Rename Project

- prefilled project name input
- current project name shown in the description
- input auto-focused
- enter submits

### Delete Project

- destructive confirmation only. No input
- Confirm button using destructive styling.

## Sidebar

Add project item actions: 

- rename
- delete

Show actions only for owned projects

Hide action for shared/collaborator projects

On mobile:
- tapping outside closes the sidebar
- add a backdrop slim

## Implementation

Create a dedicated hook to manage:

- dialog state
- form state
- loading state

Wire:

- editor home `New Project` -> Create dialog
- sidebar create -> Create dialog
- sidebar rename -> Rename dialog
- sidebar delete -> Delete dialog

Use mock projects data. No API calls or persistence


## Check when done
- sidebar actions are wired
- slug preview works
- no TypeScript errors
- no lint errors