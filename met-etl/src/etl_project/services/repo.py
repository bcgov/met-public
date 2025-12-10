from dagster import repository
from etl_project.services.jobs.met_data_ingestion import met_data_ingestion
from etl_project.services.jobs.test_db import job_sample_db_test
from etl_project.services.jobs.cleanup_old_logs import cleanup_old_logs, vacuum_met_db
from etl_project.services.schedules.met_data_ingestion_schedule import (
    met_data_ingestion_schedule,
)
from etl_project.services.schedules.cleanup_old_logs_schedule import (
    cleanup_old_logs_schedule,
    vacuum_met_db_schedule,
)


@repository
def etl_project():
    return [job_sample_db_test,
            met_data_ingestion, met_data_ingestion_schedule,
            cleanup_old_logs, cleanup_old_logs_schedule,
            vacuum_met_db, vacuum_met_db_schedule]
