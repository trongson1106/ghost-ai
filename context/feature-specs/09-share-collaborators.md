Add `Share` button functions, open the share pop up

Owners can:

- Invite collaborators to join the project by email, and by the Copied link
- View the list of collaborators
- Remove current collaborators.

Collaborators can:

- view the collaborators list only
- no invite, remove or manage access.

## Clerk User Data

Collaborators are stored by email in the database

Use Clerk Backend API to enrich collaborators emails with:

- Avatar
- displayed name

If the Clerk is not found for an email, fall back to just show the email only

## Implement

Create necessary APIs for:
- listing collaborators
- adding collaborators
- removing collaborators

Enforce ownership server-side for invite and remove actions.

Do not add a local user table.

## Check when done

- share dialog opens from the workspace
- owners can invite and remove collaborators
- collaborators can see the list of collaborators, and no more access manages
- collaborators name/avatar is loaded from Clerk if existed
- `npm run build` run successfully.







