from dagster import schedule
from etl_project.services.jobs.engagement_data_ingestion import engagement_data_ingestion


@schedule(
    cron_schedule="*/30 * * * *",
    job=engagement_data_ingestion,
    execution_timezone="Canada/Pacific",
)
def engagement_data_ingestion_schedule(_context):
    return {}
