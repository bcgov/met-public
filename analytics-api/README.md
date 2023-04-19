# MET-ANALYTICS

Python flask API application for The Modern Engagement Tool Analytics.

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
> Runs the application unit tests<br>

> `make db`
>
> Runs the application database migrations.

> `make lint`
>
> Lints the application code.