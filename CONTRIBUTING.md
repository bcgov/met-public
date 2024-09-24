# How to contribute

Government employees, public and members of the private sector are encouraged to contribute to the repository by **forking and submitting a pull request**.

(If you are new to GitHub, you might start with a [basic tutorial](https://help.github.com/articles/set-up-git) and check out a more detailed guide to [pull requests](https://help.github.com/articles/using-pull-requests/).)

Pull requests will be evaluated by the repository guardians on a schedule and if deemed beneficial will be committed to the main branch.

All contributors retain the original copyright to their stuff, but by contributing to this project, you grant a world-wide, royalty-free, perpetual, irrevocable, non-exclusive, transferable license to all users **under the terms of the [license](./LICENSE) under which this project is distributed**.

## Changelog

Developers should update the changelog with each merge into main. The changelog should reference a JIRA ticket number or, if none is associated, provide a detailed explanation of the work. The date should also be provided. No version number is necessary. For example:

```
## April 20, 2024
- Fixed bug that didn't allow users to post [DESENG-123](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-123)
```

Take note of the previous date in the changelog when committing. If the current date is at the top of the file, add a bullet for your changes under that date header.

## Pull Requests

In the PR description field, be sure to include:

- A link to the ticket describing the work
- Description of the changes (if you made any changes that weren't captured in the Jira ticket, be sure to list them here)
- The linked ticket for updating the user guide, if applicable. When functionality changes, we'll want to be sure to update the user guide for MET. Create a separate ticket for this and link it, if necessary. Otherwise, you can just write "N/A"

If a high volume of changes is to be submitted as a PR, we ask that the work be segmented into multiple PRs. A common threshold is that a PR should contain 20 changed files at most. Of course it also depends on the complexity of the changes but we ask that work be broken up into smaller logical chunks whenver possible.

### Examples

1. Let's say you've added 5 new files and made complex changes to 10 others. You also have 5 files that have minor changes in syntax as a result of running the linter. This would be a good place to submit a PR.
2. You have 1 new file added and you may need to make minor changes to syntax or variable names in 25-30 other files. This would be fine to submit as a single PR.

Segmenting a PR is more of an art than a science and PRs typically won't be rejected if they're larger than 20 files. How you segment may be informed by how you choose to branch in git. An example segmentation workflow is provided below.

### Segmentation technique

One common technique used for segmenting PRs is to create a "parent" feature branch off of main. From there, you can create many "child" branches from the parent. A PR is submitted each time you want to merge a child into its parent. A child branch will represent one logical division of the work and, as mentioned above, will contain no more than 20 changed files (depending on complexity of changes).

![PR Segmentation Diagram](docs/pr-segmentation.png)

With this method of segmentation, you don't need to worry about committing incomplete or broken features to main. When all child branches have been completed for the feature, the parent is then merged back into main in a final PR. This final review can contain your CHANGELOG.md entry. In the title or description of your PR, please indicate that all work has already been reviewed.

**Example**: You're tasked with adding a new page to the frontend which requires read access to the DB via a new API route. You create a feature branch off of main, then a child branch off of your feature branch. You then add the new API endpoint required. You submit a PR for this work by requesting to merge your child branch into your parent feature branch. Once merged, you create another child branch off your feature branch and add the new page. You submit this work as its own PR - merging into the parent feature branch again. All work is now complete so you finish things off by submitting a PR to merge your parent feature branch into the main branch. The work has already been approved in previous reviews. You can now choose to update the Changelog. If you need to add any additional, unreviewed work, you can make a note about it in the PR description.

## Merge Techniques

Due to how PRs are commonly segmented in this repository, and due to its active nature, rebasing is discouraged as a way to merge changes. Traditional merge commits are preferred as they preserve history and make it easier to resolve merge conflicts.

## Guidelines for reviewers

Conditions for whether to Approve or Request Changes for a PR can come with a lot of nuance. We try to err on the side of Approve unless there are obvious changes needed. Below is a list of reasons to "stop" a PR. Items with a star next to them are subject to interpretation by the review. Some items may prompt to discussion between the reviewer and the submitting developer so that choices can be justified.

Examples of when to Request Changes

- Logging functions are left in that aren't required or needed later (with exceptions for error logging, i.e. console.error, etc.)
- Commented-code is left in that isn't needed later
- Unsafe function calls like `eval()`
- Widespread incorrect syntax use (using snake case for many variables in JS when it's not required)
- Significant amount of repeition in code that can be condensed without much issue (code isn't DRY) \*
- Unnecessary function calls, overly verbose code \*

## Style Guide

- Avoid using CSS directly. Instead, style through Material UI theming or with CSS-in-JS

## Common Components/Utilities

### MET API

- `@transational`: Database method decorator. If there is an exception during execution, the entire DB session will be safely rolled back to a point in time just before the decorated function was called. If not, the session will be saved, unless autocommit is set to False. This helps replace most session management boilerplate.
- `authorization.check_auth`: Checks a user for one or more roles and for the correct engagement.
- `schema_utils.validate`: The most commonly used method for validating request data in resources. This method takes the request JSON data and compares it to a JSON file that acts as a schema for incoming requests of that type.

### MET Web

- Be sure to make use of shared components found under `src/components/common`. Below is a non-exhaustive list of common app components:
  - `Button`: A versatile button with different style types that are complimentary of MET styling. Choose a particular button style with: `variant=<"primary"|"secondary"|"tertiary"|undefined>`
  - `RichTextArea`: A WYSIWYG editor used app-wide. It will dynamically render out links and h2s as React components.
  - `Header1`, `Header2`: MET-styled h1, h2 components.
  - `ResponsiveContainer`: A container that decreases its padding on smaller screens.
  - `ResponsiveWrapper`: A route wrapper that adds a responsive container around its child routes.
  - `Pagination`: Provides a pagination UI - a wrapper around Material UI's pagination.
  - `EngagementStatusChip`: A wrapper around MUI's Chip that's styled for MET.
  - `FileUpload`: A file uploader component.
  - `MetTable`, `Table`, `TableHead`, `TableCell`, etc.: Complete table components that are wrappers around MUI tables, styled for MET.
  - `ConfirmModal`, `EmailModal`, `UpdateModal`: Common, reusable modal window types.
  - `AutoBreadcrumbs`: Automatically generates breadcrumbs based on the `handle.crumb` function of the current route and its parents.
  - `Link`: A wrapper around MUI's Link, styled for MET.
  - `UnsavedWorkConfirmation`: Uses a route [blocker](https://reactrouter.com/en/main/hooks/use-blocker) to display a ConfirmModal so that the user doesn't lose any unsaved work on their current page.
  - `OutlineBox`: A styled box that displays a rounded outline around its children.
  - `StatusIcon`: A simple component that displays a status icon based on the status string passed to it.
  - `FormStep`: A wrapper around a form component that accepts a completion criteria and displays the user's progress. Accepts a `step` prop that is a number (from 1 to 9) that represents the current step in the form. This will be rendered as an icon with a checkmark if the step is complete, and a number if it's the current step or if it's incomplete.
  - `SystemMessage`: An informational message that can be displayed to the user. Accepts a `type` prop that can be "error", "warning", "info", or "success", which affects the display of the message.
  - `WidgetPicker`: A modular widget picker component that can be placed anywhere in the engagement editing area. In order to align widgets in the backend with the frontend, a "location" prop is required. Add new locations to the `WidgetLocation` enum.
  - `ErrorMessage`: A styled error message that can be displayed to the user. Accepts a `message` prop that is the error message to display.
  - `TextInput`: A styled text input that can be used in forms. Accepts a `placeholder` and all other props that a normal MUI TextField would accept.
  - `TextField`: A convenience wrapper around `TextInput` that includes a label, requirement decorations, and helper/error text. Error text is internally rendered by `ErrorMessage`.
