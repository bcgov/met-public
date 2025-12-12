from dagster import ScheduleDefinition
from etl_project.services.jobs.cleanup_old_logs import cleanup_old_logs, vacuum_met_db
cleanup_old_logs_schedule = ScheduleDefinition(
    job=cleanup_old_logs,
    cron_schedule="0 3 * * *",  # Every day at 3am
    execution_timezone="Canada/Pacific"
)

vacuum_met_db_schedule = ScheduleDefinition(
    job=vacuum_met_db,
    cron_schedule="0 4 */7 * *",  # Every 7 days at 4am
    execution_timezone="Canada/Pacific"
)
