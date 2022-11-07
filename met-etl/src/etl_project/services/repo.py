from dagster import repository
from jobs.met_data_ingestion import met_data_ingestion
from jobs.test_db import job_sample_db_test
from schedules.met_data_ingestion_schedule import (
    met_data_ingestion_schedule,
)

@repository
def etl_project():
    return [job_sample_db_test, met_data_ingestion, met_data_ingestion_schedule]