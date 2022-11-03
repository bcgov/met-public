from dagster import schedule
from jobs.met_data_ingestion import met_data_ingestion


@schedule(
    cron_schedule="* 1 * * *",
    job=met_data_ingestion,
    execution_timezone="US/Central",
)
def met_data_ingestion_schedule(_context):
    return {}
