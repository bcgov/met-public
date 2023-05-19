# MET-ANALYTICS

Python flask API application for The Modern Engagement Tool Analytics. 

As part of the project an analytics data warehouse was modeled and developed to store the data necessary for reporting. An ETL job runs at regular intervals to extract, transform and load the required data from the application database to analytics database. This way we are able to maintain a history for the data without loosing track of changes that might have happened on the data. 

The API was developed to connect and pull data from analytics database for the purpose of reporting. End points are designed to pull aggregated data as required for the visual representation from the analytics database.

## Getting Started

### Development Environment
* Install the following:
    - [Python](https://www.python.org/)
* Install Dependencies
    - Run `make setup` in the root of the project (analytics-api)

## Environment Variables

The development scripts for this application allow customization via an environment file in the root directory called `.env`. See an example of the environment variables that can be overridden in `sample.env`.

## Commands

### Development

The following commands support various development scenarios and needs.


> `make run`
>
> Runs the python application.  

> `make test`
>
> Runs the application unit tests

> `make db`
>
> Runs the application database migrations.

> `make lint`
>
> Lints the application code.