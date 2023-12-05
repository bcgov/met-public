## December 5, 2023
- **Task** Remove unused project metadata [🎟️DESENG-441](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-441)

## November 29, 2023
- **Feature** Superusers can publish engagements without attached surveys [🎟️DESENG-438](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-438)

## November 11, 2023
- **Feature**: Started logging source url path with feedback submission. Viewable in dashboard. [🎟️DESENG-415](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-415)
- **Bug Fix**: Removed a duplicate service class. [🎟️DESENG-429](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-429)

## October 26, 2023
- **Bug Fix**: Upgraded BC-Sans font to newest version. [🎟️DESENG-413](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-413)
- **Bug Fix**: Engagements will now open in the same browser window/tab, not a new one. [🎟️DESENG-421](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-421)
- **Bug Fix**: Update sample .env files - [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414)
- Sample .env files have been updated to reflect the current state of the project.
- *Breaking*: Keycloak URLs and resources now point to the BC Government's SSO service when using `sample.env` as a baseline
- *Breaking*: The `met_api` module has been updated slightly to consume Pathfinder SSO's API schema.
- Changes to `DEVELOPMENT.md` to reflect the current state of the project
- Remove one old production .env file with obsolete settings

## October 1, 2023
- App handoff from EAO to GDX
- Added changelog