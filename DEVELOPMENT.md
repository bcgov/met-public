# Local Setup

## Database

A postgres database instance is required to run the app locally.
The below docker compose command will setup the initial database structure and run a postgres container:

```
docker compose -f ./tools/postgres/docker-compose.yml up -d
```

## Keycloak 

A local instance of keycloak might be necessary. The following configuration uses the database above, schema "keycloak". Run the following command:

```
docker compose -f ./tools/keycloak/docker-compose.yml up -d
```


## met-api
## analytics-api
## notify-api

Create a .env file based on the sample.env

To install packages:

```
make setup
```

To run the project:

```
make run
```

## met-cron

Create a .env file based on the sample.env

To install packages:

```
make setup
```

This is a task scheduler project, to run tasks manually use the following commands:

```
make run_closeout
```
```
make run_publish
```

## met-etl

Create a .env file based on the sample.env

This is a dagster project, to run it use the following commands:

```
docker compose up
```

## dagster

Create a .env file based on the sample.env

This is a dagster project, to run it use the following commands:

```
docker compose up
```

## redash

A custom redash project is used for some of the dashboards whithin MET.

To start an instance clone the following repository:
```
git clone https://github.com/bcgov/redash
```

create a .env file with the following:
```
REDASH_COOKIE_SECRET=redash
```

Run the docker compose command:
```
docker compose up
```