## May 7, 2024

- **Feature** Ensure users can belong to more than one tenant [🎟️ DESENG-478](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-478)
  - Tested users can belong to more than one tenant.
  - Overide the default tenant filter for staff_user table to check with user_group_membership table.
  
## May 6, 2024

- **Feature** Auto-populate question descriptions [🎟️ DESENG-596](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-596)
  - Upgrading the version of met-formio to version 1.0.15-rc1. This version has the changes to have a default 
  description for the form components. The changes were pushed to met-formio by the PR: https://github.com/bcgov/met-formio/pull/25.

## May 2, 2024

- **Feature** Added a new landing page for tenant management [🎟️ DESENG-591](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-591)
  - The page will be updated to list and manage tenants in upcoming tickets.

## April 30, 2024

- **Task** Dagster ETL error [DESENG-599](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-599)
  - Upgrading the version of python to 3.12 for dagster user code
  - Upgrading the dependencies to support the version of python.
  - Fixing a bug on survey etl service.
- **Feature** Add Super Admin role [🎟️ DESENG-557](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-557)
  - Added a new role, `SUPER_ADMIN`, to MET.
  - The `SUPER_ADMIN` role has the highest level of access in the MET application.
  - The `SUPER_ADMIN` role can perform all actions in MET, including actions in other tenants.
  - The role can be only be assigned through the single sign-on (SSO) service.
  - This overrides any other permissions set, e.g, a Viewer user who gets the super_admin role
    will have all the permissions of a normal super admin.
  - Change the React app's admin role to `SUPER_ADMIN` (previously `CREATE_TENANT`).
  - Force all UI elements to be enabled for the `SUPER_ADMIN` role.
  - Added unit tests for the new role, and updated an existing test related to cross-tenant access.

## April 29, 2024

- **Task** Upgrade python to 3.12 [DESENG-466](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-466)
  - Upgrading the version of python to 3.12
  - Upgrading the dependencies to support the version of python.
  - Modify code as needed if the newer version does not support the former.

## April 22, 2024

- **Task** Openshift - Update the buildconfig for the MET-cron job runner [🎟️ DESENG-559](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-559)
  - Versioning now uses the openshift.io namespace
- **Task** In-app role management [DESENG-574](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-574)
  - Introduced new database models to manage user roles and user-to-role mappings in the Met database.
  - Revamped the authentication validation process to rely on roles retrieved directly from the database,
    rather than relying solely on token-based roles.
  - Eliminated redundant or unused roles from the system.
  - Updated unit tests to to fetch roles directly from the database instead of relying on role generation from the factory and eliminated the Keycloak mock.
  - Renamed admin and viewer role.
  - Removed the usage of CSS API for role management.

## April 11, 2024

- **Task** Multi-language - Create engagement content translation tables & API routes [DESENG-544](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-544)
  - Created a new table for engagement content translations
  - Created API routes and services for engagement content translations
  - Created Unit tests for engagement content translations

## April 10, 2024

- **Task** Remove default taxa from GDX tenant [DESENG-578](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-578)
  - Removed the pre-populated taxon entries from the GDX tenant.
  - With the power of the editor interface, tenants are now expected to create their own taxon entries.
- **Task** Update contributing guide for developers [DESENG-475](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-475)

## April 09, 2024

- **Bugfix**: Stop Axios from trying to be a smarty pants and sending data in a format Flask doesn't understand [🎟️ DESENG-580](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-580)
  - This was preventing the filtering feature from working
  - Directly serialize any metadata filters before the request to avoid Axios's new nested object serialization
  - Deserialize it again on the Flask side
- **Task**: MET Web - Some URLs not taking users to correct locations/timing out [DESENG-542](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-542)
  - Created authentication provider to know the logged-in state before the App component is rendered.
  - Optimized tenant identification from the url.
  - Optimized path segments identification.
- **Task**: CSS Selector specificity [🎟️ DESENG-577](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-577)
  - Replace the `!important` flag with more specific CSS selectors, specifically within dropdowns,
    to ensure that the correct styles are applied, and that states we have not yet designed for
    (e.g, complex focus states) are still styled appropriately and in an accessible manner.
  - Soon, we will be doing a more in-depth revamp of dropdowns in the app to make them more
    accessible and user-friendly. This helps work towards that goal.
- **Bugfix**: MET Web - No save feedback unless main content tab is selected [🎟️ DESENG-541](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-541)
  - Implemented notifications for successful saves across all engagement tabs.
  - Resolved issue with saving engagement summary content during engagement creation.
  - Updated tooltip on engagement content to use MetTooltip for consistency.

## April 08, 2024

- **Bugfix**: Submission of rejected comments [🎟️ DESENG-527](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-527)
  - Fixed issue where resubmitted comments would not reappear in the queue for approval.
  - Added unit tests to ensure the issue does not reoccur.
- **Task**: MET - Clean up outstanding dependabot PRs [DESENG-535](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-535)
  - Bump axios from 0.26.1 to 0.28.0 in met-web. Dependabot suggested this upgrade, but it required a few minor code changes.
  - Updated the type definition of the 'error' parameter to include a generic type '{ message?: string }' to handle the AxiosError response properly.

## April 05, 2024

- **Task**: Allow for any gov.bc.ca email to receive emails in MET's dev & test environments [DESENG-533](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-533)
  - Enabled dev open shift to use GC_NOTIFY api key of test which allows all email.
  - Added new env var `SEND_EMAIL_INTERNAL_ONLY` to allow for internal emails such as govt emails only.

## April 04, 2024

- **Feature** Engagement filtering - Add filtering by taxon [🎟️DESENG-445](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-445)

  - Added properties to metadata taxa to allow them to be marked as filterable.
  - Added a new file `filter_types.py` where additional filters can be added as subquery factory functions.
  - Added a new endpoint to the API to retrieve filterable taxa.
  - Modified the search endpoint to allow filtering by metadata.
  - Added schemas, data validation and unit tests for the new functionality.
  - Updated the Metadata Management UI to allow taxa to be marked as filterable.
    - Currently, the only two filter types are `chips_any` and `chips_all`.
    - `chips_any`: Displays as a series of toggleable buttons ("chips"), uses the `list_match_any` subquery returning engagements with any of the selected values.
    - `chips_all`: Similar to chips_any; uses the `list_match_all` subquery to get only engagements with ALL of the selected values.
  - If multiple filterable taxa are selected, all the taxon filters must be met for an engagement to be returned.
  - Updated the public-facing engagement list to allow filtering by metadata taxa. This makes use of the new API endpoint to retrieve filterable taxa.
  - Added a new filter "drawer" to the listing page to hold these and any future filter types.
  - (Out of scope, but related to UX work for this ticket) Fixed a display issue with the public engagements page where engagements would not take up the full width of their grid cell.

- **Task**: Keycloak Unit Tests for New CSS API Integration [DESENG-508](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-508)
  - Updated Keycloak Unit Tests for New CSS API Integration.

## April 02, 2024

- **Task**: DEV clean up [DESENG-503](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-503)
  - Updated deployment configurations to add new configs.

## March 28, 2024

- **Bug Fix**: Feedback fixes [DESENG-524](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-524)
  - Fixed feedback path not updating issue.
  - Fixed feedback table grid styles.

## March 27, 2024

- **Bug Fix**: MET - Engagement tab does not revert the filtered out data [DESENG-525](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-525)
  - Resetting search filter values invoke the list to reload
- **Task**: Add missing unit tests for analytics api [DESENG-482](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-482)
  - Added unit tests for analytics API models and API end points

## March 26, 2024

- **Bug Fix**: Various bugs in the survey tab [DESENG-520](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-523)
  - Update survey components and services to fix the bugs.
    - Removed is_template and is_hidden values from autosaving to avoid the debounce function consuming it older values
- **Task**: Add a custom dynamic page to engagement [DESENG-501](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-501)
  - Integrated new summary and custom content tabs into the engagement form, providing users with structured sections for managing different types of content, enhancing overall organization and user experience.
  - Implemented functionality to allow users to add custom tabs with a variety of provided icons, along with options to edit or delete tabs as needed, granting users greater flexibility and control over their engagement content layout.
  - Streamlined data management by transitioning content and rich content from engagement tables to dedicated content tables, while also implementing logic to automatically generate default summary and custom content upon engagement creation or tab addition, ensuring consistent content structure and user experience.

## March 21, 2024

- **Task**: MET Web - Replace hover & background colours [DESENG-520](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-520)
  - Update Table and Menu Dropdown hover colors
  - Update engagement tiles hover color.
  - Updated all white backgrounds to use css variable.

## March 19, 2024

- **Task**: Add poll results to results tab [DESENG-513](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-513)
  - Added poll results to results tab.
  - Added poll results API.
  - Added Unit tests.
- **Task**: Change static english text to be able to support string translations [DESENG-467](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-467)
  - Implemented a language selector in the public header.
  - Incorporated logic to dynamically adjust the unauthenticated route based on the selected language and load the appropriate translation file.
  - Enhanced all public pages to fetch static text from the translation file.

## March 15, 2024

- **Task**: Multi-language - Create event, subcribe_item, poll, timeline widget translation tables & API routes [DESENG-515](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-515)
  - Added Poll answer translation API.
  - Added Timeline Event translation API.
  - Added Subscribe Item translation API.
  - Added Event item translation API
  - Added Unit tests.
- **Task** Add "Results" page to engagements [DESENG-512](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-512)

## March 08, 2024

- **Task**: Multi-language - Create engagement translation table & API routes [DESENG-510](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-510)
  - Added Engagement translation model.
  - Added Engagement translation API.
  - Added Unit tests.

## March 07, 2024

- **Task**: Remove "default_values" from metadata taxa.
  Replace with "preset values", metadata entries that are not assigned to an engagement.
- **Task**: Update authorization documentation in the API blueprint. Update
  metadata management to rely on normal authorization check functions.
- **Task**: Clean up metadata management code and tests.
- **Task**: Add endpoint for updating metadata by taxon in bulk
- **Feature**: Add editor for metadata taxa (admin only). [🎟️DESENG-443](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-443)
- **Feature**: Add editor for metadata entries (available to anyone who can
  edit an engagement). [🎟️DESENG-443](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-443)

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
  - Created API to manage Widget Poll, Poll Answers, Poll Response.
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
