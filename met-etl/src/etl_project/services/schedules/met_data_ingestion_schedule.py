from dagster import schedule
from etl_project.services.jobs.met_data_ingestion import met_data_ingestion


@schedule(
    cron_schedule="*/30 * * * *",
    job=met_data_ingestion,
    execution_timezone="Canada/Pacific",
)
def met_data_ingestion_schedule(_context):
    return {}
