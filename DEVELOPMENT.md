# Local Setup

## Database

A postgres database instance is required to run the app locally.
The below docker compose command will setup the initial database structure and run a postgres container:

```
docker compose -f ./tools/postgres/docker-compose.yml up -d
```

## Keycloak 

A local instance of keycloak might be necessary. to do so run the following docker compose:

```
docker compose -f ./tools/keycloak/docker-compose.yml up -d
```

Authenticate to the keycloak console and create a new realm importing the configuration file: