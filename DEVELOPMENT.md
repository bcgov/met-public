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

## met-web

Create a .env file based on the sample.env

Installing the packages:

```
npm install
```

Starting the app:

```
npm start
```

Running the unit test:

```
npm run test
```

## met-api
## analytics-api
## notify-api

Create a .env file based on the sample.env

Installing the packages:

```
make setup
```

Starting the app:

```
make run
```

Running the unit test:

```
make test
```

## met-cron

Create a .env file based on the sample.env

Installing the packages:

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

Running the app:

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