# DEP Dagster ETL

Custom Dagster ETL code for The Digital Engagement Platform project. The assets are organized into ops, jobs and schedules.

### Folder Details

| Folder name | Path                                   | Reference                                                                                    |
| ----------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `ops`       | etl/src/etl_project/services/ops       | [Dagster ops](https://docs.dagster.io/concepts/ops-jobs-graphs/ops)                          |
| `jobs`      | etl/src/etl_project/services/jobs      | [Dagster jobs](https://docs.dagster.io/concepts/ops-jobs-graphs/jobs)                        |
| `schedules` | etl/src/etl_project/services/schedules | [Dagster schedules](https://docs.dagster.io/concepts/partitions-schedules-sensors/schedules) |

## Getting Started

### Environment Variables

The development scripts for this application allow customization via an environment file in the root directory called `.env`. See an example of the environment variables that can be overridden in `sample.env`.

### Development Environment

Running the application

- Modify the environment variables
- `cd etl`
- Run `docker-compose up -d` to start.

This will build the Docker image and pull Postgresql dependency. The dagster
dashboard is then available on http://localhost:3000
