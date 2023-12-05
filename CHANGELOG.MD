# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

### December 4, 2023

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
  
### November 29, 2023

- **Feature**: Superusers can publish engagements without attached surveys [🎟️DESENG-438](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-438)

### November 11, 2023

- **Feature**: Started logging source URL path with feedback submission, viewable in the dashboard [🎟️DESENG-415](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-415)
- **Bug Fix**: Removed a duplicate service class [🎟️DESENG-429](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-429)

### November 6, 2023

- **Feature**: Switch MET to use Keycloak SSO service [🎟️DESENG-408](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-408)
- **Feature**: .env var audit and cleanup [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414) (work begun)

### October 26, 2023

- **Bug Fix**: Upgraded BC-Sans font to the newest version [🎟️DESENG-413](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-413)

- **Bug Fix**: Engagements now open in the same browser window/tab [🎟️DESENG-421](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-421)

- **Bug Fix**: Update sample .env files [🎟️DESENG-414](https://apps.itsm.gov.bc.ca/jira/browse/DESENG-414)

  - Sample .env files have been updated to reflect the current state of the project.
  - *Breaking*: Keycloak URLs and resources now point to the BC Government's SSO service when using `sample.env` as a baseline
  - *Breaking*: The `met_api` module has been updated slightly to consume Pathfinder SSO's API schema.
- Changes to DEVELOPMENT.md to reflect the current state of the project
- Remove one old production .env file with obsolete settings

### October 1, 2023

- App handoff from EAO to GDX
- Added changelog
