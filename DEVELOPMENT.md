# Local Setup

## Database

A postgres database instance is required to run the app locally.
The below docker compose command will setup the initial database structure and run a postgres container:

```
docker compose -f ./tools/postgres/docker-compose.yml up -d
```

⚠️ Note that the following sections assume your working directory is the listed component's root directory (e.g. `met-api`, `met-web`)

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

Manually upgrading the database:
*This wil also create some default data for the app if it does not exist*

```
make db
```

Starting the app (automatically upgrades the database):

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