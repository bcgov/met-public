from dagster import repository
from jobs.met_data_ingestion import met_data_ingestion
from schedules.met_data_ingestion_schedule import (
    met_data_ingestion_schedule,
)

@repository
def etl_project():
    return [met_data_ingestion, met_data_ingestion_schedule]