Adjust the `Share` Dialog of the owner and collaborators

## Fix the Remove actions
- When we click remove the collaborators, they are not removed and still appear on the list, and still have access to the project.
- When click remove button, pop-up a dialog asking for confirmation of the owner, containing a red title, a description and 2 buttons of `Remove` and `Cancel`

## Owner `Share` dialog
- While typing in the collaborator's email, there is a dropdown below the input, showing suggestion of emails having similar characters.
- When click on that suggestion, the input is filled with that email, but not added, wait for the add action from the user
- If there is no such email exist, do NOT add that collaborator, make the input red and a description below it.

## Collaborator `Share` dialog
- Add a `OWNER` line above the `COLLABORATORS` line, showing the owner of the project.
