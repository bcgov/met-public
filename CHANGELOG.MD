# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

## v1.1.0 - 2023-11-06 (⭐CURRENT)
> **Feature**: Switch MET to use Keycloak SSO service - [🎟️DESENG-408](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-408)
> - Switch all role-based checks on the API to use a single callback function (`current_app.config['JWT_ROLE_CALLBACK']`) 
> - Added a configurable path `JWT_ROLE_CLAIM` to indicate where your SSO instance places role information in the JWT token. If your access token looks like:
> `{ ..., "realm_access": { "roles": [ "role1", "role2"]}}` you would set `JWT_ROLE_CLAIM=realm_access.roles`
> - Remove local Keycloak instances and configuration


## v1.0.1 - 2023-10-26

> **Bug Fix**: Upgraded BC-Sans font to newest version. [🎟️DESENG-413](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-413)
> **Bug Fix**: Engagements will now open in the same browser window/tab, not a new one. [🎟️DESENG-421](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-421)
> **Bug Fix**: Update sample .env files - [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414)
>- Sample .env files have been updated to reflect the current state of the project.
>- *Breaking*: Keycloak URLs and resources now point to the BC Government's SSO service when using `sample.env` as a baseline
>- *Breaking*: The `met_api` module has been updated slightly to consume Pathfinder SSO's API schema.

- Changes to `DEVELOPMENT.md` to reflect the current state of the project
- Remove one old production .env file with obsolete settings


## v1.0.0 - 2023-10-01

- App handoff from EAO to GDX
- Added changelog