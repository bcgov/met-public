# DEP CRON Job Scheduler

Python job scheduler application for The Digital Engagement Platform project.

## Getting Started

### Development Environment

- Install the following:
  - [Python](https://www.python.org/)
- Install Dependencies
  - Run `make setup` in the root of the project (`cron/`)

## Environment Variables

The development scripts for this application allow customization via an environment file in the root directory called `.env`. See an example of the environment variables that can be overridden in `sample.env`.

## Commands

### Development

The following commands support various development scenarios and needs.
Before running the following commands run `. venv/bin/activate` to enter into the virtual env.

> `make run`
>
> Runs the python application.

> `make test`
>
> Runs the application unit tests<br>

> `make lint`
>
> Lints the application code.

To run cron functionality on your local machine execute the python commands located in the run files of this directory.
For example the `run_met_publish.sh` file contains the command to publish a scheduled engagement

> `python3 invoke_jobs.py ENGAGEMENT_PUBLISH`
