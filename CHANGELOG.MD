# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).


## v1.0.1 - 2023-10-26

> **Bug Fix**: Upgraded BC-Sans font to newest version - [🎟️DESENG-413](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-413)
>- BC-Sans font has been updated to version 2.0

> **Bug Fix**: Open engagements in the same window -  [🎟️DESENG-421](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-421)
>- Landing page links now open in the same browser tab & window by default

> **Bug Fix**: Update sample .env files - [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414)
>- Sample .env files have been updated to reflect the current state of the project.
>- *Breaking*: Keycloak URLs and resources now point to the BC Government's SSO service when using `sample.env` as a baseline
>- *Breaking*: The `met_api` module has been updated slightly to consume Pathfinder SSO's API schema.

- Changes to `DEVELOPMENT.md` to reflect the current state of the project
- Remove one old production .env file with obsolete settings


## v1.0.0 - 2023-10-01

- App handoff from EAO to GDX
- Added changelog