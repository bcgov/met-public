## January 15, 2024

- **Task** Audit for missing unit tests [🎟️DESENG-436](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-436)
  - Corrected tests to execute smoothly in the local environment using development variables.
  - Established continuous integration configuration to automatically run tests upon each commit.
  - Ensured that the tests pass successfully in our GitHub test environment.
- **Task** Audit for missing unit tests [🎟️DESENG-449](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-449)
  - Identified and corrected failing unit test for api and web
- **Bug Fix**: Fixing Form.io error when reordering Radio Button options [🎟️DESENG-446](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-446)

## January 10, 2024

- **Task** Custom Consent per Engagement [🎟️DESENG-456](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-456)
- **Task** Engagement Edit Screen Reorder/Redesign [🎟️DESENG-448](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-448)
  - Added new tab Addional Details and moved metadata inside that
  - Moved public url section inside Settings tab
  - Changed Engagement Details to Engagement Core
  - Removed Links tab

## January 9, 2024

- **Task** Improvements from Epic [🎟️DESENG-468](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-468)
  - Improvements to Survey Result Tracking analytics
  - New Rejection Email Template for Closed Engagements
  - Export Format for Proponent updated to be in excel format
  - Formio Version Update
  - Enable Survey Editing for Open Engagements

- **Bug Fix**: Fixing timezone issue while publishing using met cron [🎟️DESENG-437](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-437)

## December 28, 2023

> **Feature**: Added the timeline widget. [🎟️DESENG-439](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-439)

## December 11, 2023

- **Task** Merge `gdx-sso`, `gdx-dev`, `gdx-main` into `main` [🎟️DESENG-442](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-442)

## December 5, 2023

- **Task** Remove unused project metadata [🎟️DESENG-441](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-441)

## December 4, 2023

- **Feature**: .env var audit and cleanup [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414) (work finished)
  - Full rewrite of met_api/config.py
  - Sample .env files updated to capture all current settings
  - Changed many configs to use a nested dict structure
  - Changed all configs to use get_named_config() to access settings
  - SQLAlchemy now generates its url based on db settings
  - Default settings are handled more gracefully
  - Enable file-watching reloader and debugger for development environments
  - Inline documentation added in config.py
  - Removed unused settings

## November 29, 2023

- **Feature**: Superusers can publish engagements without attached surveys [🎟️DESENG-438](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-438)

## November 21, 2023

- **Feature**: Started logging source url path with feedback submission. Viewable in dashboard. [🎟️DESENG-415](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-415)

## November 11, 2023

- **Bug Fix**: Removed a duplicate service class [🎟️DESENG-429](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-429)

## November 6, 2023

- **Feature**: Switch MET to use Keycloak SSO service [🎟️DESENG-408](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-408)
  - Switch all role-based checks on the API to use a single callback function (`current_app.config['JWT_ROLE_CALLBACK']`)
  - Added a configurable path `JWT_ROLE_CLAIM` to indicate where your SSO instance places role information in the JWT token. If your access token looks like:
  `{ ..., "realm_access": { "roles": [ "role1", "role2"]}}` you would set `JWT_ROLE_CLAIM=realm_access.roles`
  - Explicitly disable single tenant mode by default to ensure correct multi-tenancy behaviour
  - Remove local Keycloak instances and configuration
  - Default to the "standard" realm for Keycloak
  - Use tenancy information from DB rather than Keycloak

- **Feature**: .env var audit and cleanup [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414)

## October 26, 2023

- **Bug Fix**: Upgraded BC-Sans font to the newest version [🎟️DESENG-413](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-413)

## October 19, 2023

- **Feature**: Update sample .env files [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414)
  - Sample .env files have been updated to reflect the current state of the project.
  - Keycloak URLs and resources now point to the BC Government's SSO service when using `sample.env` as a baseline
  - The `met_api` module has been updated slightly to consume Pathfinder SSO's API schema.
  - Remove one old production .env file with obsolete settings
- Changes to DEVELOPMENT.md to reflect the current state of the project


## v1.0.0 - 2023-10-01

- App handoff from EAO to GDX
- Added changelog
