# MET Notifications API

Python flask notification API application for The Modern Engagement Tool project.

## APIs are hosted at api/v1/notifications/email

Currently Notification API wraps over GC Notify(https://notification.canada.ca/) and CHES (https://getok.nrs.gov.bc.ca/)

## Getting Started

### Development Environment
* Install the following:
    - [Python](https://www.python.org/)
* Install Dependencies
    - Run `make setup` in the root of the project (met-api)

## Environment Variables

The development scripts for this application allow customization via an environment file in the root directory called `.env`. See an example of the environment variables that can be overridden in `sample.env`.

## Commands

### Development

The following commands support various development scenarios and needs.


> `make run`
>
> Runs the python application and runs database migrations.  
Open [http://localhost:5000/api](http://localhost:5000/api) to view it in the browser.<br/>
> The page will reload if you make edits.<br/>
> You will also see any lint errors in the console.

> `make test`
>
> Runs the application unit tests<br>

> `make lint`
>
> Lints the application code.