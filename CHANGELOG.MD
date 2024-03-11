## March 08, 2024
- **Task**Multi-language - Create engagement translation table & API routes [DESENG-510](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-510)
    - Added Engagement translation model.
    - Added Engagement translation API.
    - Added Unit tests.

## March 06, 2024
- **Task**Multi-language - Create simple widget translation tables & API routes [DESENG-514](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-514)
    - Added Widget translation model.
    - Added Widget translation API.
    - Added Unit tests.
- **Task**Multi-language - Create survey translation table & API routes [DESENG-511](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-511)
    - Added Survey Translation model.
    - Added Survey Translation API.
    - Added Survey Translation tests.

## March 04, 2024
- **Task**Engagement "save" enhancements [DESENG-507](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-507)
    - The existing "Save" button in the floating bar has been split into two distinct actions: "Save and Continue" and "Save and Exit".
    - Tabs are greyed out, and widgets are disabled until the engagement is successfully saved. A helpful tool-tip has been added to inform users that the engagement needs to be saved before accessing certain features.
    - Independent save buttons previously present in tabs, such as "Additional Details", "Settings" have been removed. Now, the floating save bar is universally employed when editing an engagement.
- **Task**Multi-language - Create language table & API [DESENG-509](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-509)
    - Added Language model.
    - Added Language API.
    - Added Unit tests.

## February 27, 2024
- **Bug Fix**Comments cannot be approved while reviewing [DESENG-496](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-496)
    - Fixed by adding a missing decorator for transactional methods.
- **Task**Enhance analytics api for Improved Readability and Maintainability [DESENG-492](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-492)
    - Refactor analytics-api config to harmonize its structure and conventions with met-api.
    - Ensure the sample.env file maintains consistent formatting.
    - Adjusted the component_id column size in the comment table of the met-api to resolve an error encountered during user submissions.

## February 26, 2024
- **Task**Models for dynamic engagement pages [DESENG-500](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-500)
    - Implemented endpoints for dynamic engagement pages, including summary and custom sections.
    - Default behavior ensures that each engagement has a dynamic summary page.
    - Introduced logic to migrate existing content and rich content for engagements to the summary table.
- **Task**Add font awesome libraries [DESENG-490](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-490)
    - Added related libraries to the frontend package.json.
- **Task**Adding missing unit test [DESENG-483](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-483)
    - Added missing unit test for components.

## February 20, 2024
- **Task**Upgrade the version of flask [DESENG-502](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-502)
    - Performed a Flask version upgrade to version 2.2.5.

## February 16, 2024
- **Task**Make a floating save/preview bar when editing engagements [DESENG-498](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-498)
    - Implemented a floating behavior for the save/preview buttons during engagement editing. This feature persists across all tabs but exclusively saves data for the Engagement Content tab.

## February 15, 2024
- **Task**Restore role assignment functionality to MET with the CSS API [DESENG-473](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-473)
    - Utilize the CSS API for efficient management of composite roles. This involves the assignment, reassignment, or removal of users from the composite roles of TEAM_MEMBER, REVIEWER, IT_ADMIN, or IT_VIEWER.

## February 09, 2024
- **Task**Consolidate and re-write old migration files [DESENG-452](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-452)
    - Deleted old migration files
    - Created [ec0128056a33_table_until_feb_09_2024.py](met-api/migrations/versions/ec0128056a33_table_until_feb_09_2024.py) with all tables until feb 09 2024
    - Created [37176ea4708d_data_until_feb_09_2024.py](met-api/migrations/versions/37176ea4708d_data_until_feb_09_2024.py) with all initial data until feb 09 2024

## February 08, 2024
- **Task**Cache CORS preflight responses with the browser for a given period of time [DESENG-484](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-484)
    - Introduces a new configuration variable to specify the maximum age for Cross-Origin Resource Sharing (CORS)
    - Modified the CORS preflight method to utilize this newly introduced variable.
- **Task**Consolidate and re-write old migration files [DESENG-452](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-452)
    - Change some foreign key field to nullbale false in model files
    - Change `rejected_reason_other` to nullable true in `submission` model
    - Generated new migration file based on the pending model changes which confirmed to be valid
    - Updated Unit test of email verfication to send type to the api

## February 06, 2024
- **Task**Convert keycloak groups to composite roles for permission levels [DESENG-447](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-447)
    - Commented out unit test related to Keycloak groups
    - Changed reference of Keycloak `groups` to `roles`
    - Commented out code related to Keycloak groups

## February 06, 2024
- **Task** Streamline CRON jobs [DESENG-493](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-493)
  - Aligned the CRON configuration and sample environment files with the structure used in the Met API.
  - Eliminated the reliance on engagement metadata within CRON jobs.
  - Implemented necessary code adjustments to seamlessly integrate with the updated CRON configuration.

## February 05, 2024
- **Task** Change "Superuser" to "Administrator" [DESENG-476](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-476)

## February 02, 2024
- **Task** Updated Timeline widget icons so that the circles are more consistent. [🎟️DESENG-488](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-488)

## February 01, 2024
- **Task** Change name from "Engagement Core" to "Engagement Content". [🎟️DESENG-489](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-489)

## January 29, 2024
- **Task** Updated Babel Traverse library. [🎟️DESENG-474](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-474)
  - Run `npm audit fix` to update the vulnerable Babel traverse library.

## January 26, 2024
- **Task** Poll Widget: Front-end. [🎟️DESENG-464](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-464)
  - Created UI for Poll Widget.
  - Updated Poll widget API and unit tests.

## January 25, 2024
- **Task** Resolve issue preventing met-web from deploying on the Dev OpenShift environment. [🎟️DESENG-469](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-469)
  - Remove Epic Engage-related links and update Keycloak link.
  - Remove additional authentication method.

## January 24, 2024
- **Task** Update default project type to GDX for all deployments by default. [🎟️DESENG-472](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-472)
  - Set the default project type to GDX on all continuous deployment (CD) files.
  - Removed the option to deploy to EAO.

## January 22, 2024
- **Task** Poll Widget: Back-end [🎟️DESENG-463](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-463)
  - Created Database models for Widget Poll, Poll Answers, Poll Response.
  - Created API to manage  Widget Poll, Poll Answers, Poll Response.
  - Created Unit tests to test the code.
- **Task** Add missing unit tests for met api [🎟️DESENG-481](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-481)
  - Added missing unit tests for met api
  - Added unit tests for error handling for met api

## January 19, 2024

- **Feature**: Add metadata management to the API [🎟️DESENG-442](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-442)
  - Add new models, services, and endpoints for metadata and metadata taxonomy
  - Add test coverage for new endpoints
  - Begin documenting new endpoints using Flask-RESTX
  - Add new endpoints to the API blueprint
  - Enabled pylint for flask and flask_sqlalchemy in vscode
  - Created a new "transactional" decorator to wrap model methods in a transaction that safely rolls back on error
  - Stub out frontend components for metadata management in preparation for the next step
- **Task**: Continue switching staff users to db-based (rather than keycloak based) authentication

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

- **Feature**: Added the timeline widget. [🎟️DESENG-439](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-439)

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
