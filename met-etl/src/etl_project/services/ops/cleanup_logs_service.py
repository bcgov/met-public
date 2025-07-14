from dagster import op
from datetime import datetime, timedelta, UTC

MAX_AGE_DAYS = 45  # Define the maximum age of logs to keep (in days)

@op(required_resource_keys={"met_db_session"})
def cleanup_old_event_and_run_logs(context):
    cutoff_date = datetime.now(UTC) - timedelta(days=MAX_AGE_DAYS)
    session = context.resources.met_db_session
    # Delete event logs
    deleted_event = session.execute(
        """
        DELETE FROM dagster.event_logs WHERE created_at < :cutoff_date
        """,
        {"cutoff_date": cutoff_date}
    )
    # Delete run logs
    deleted_run = session.execute(
        """
        DELETE FROM dagster.runs WHERE created_at < :cutoff_date
        """,
        {"cutoff_date": cutoff_date}
    )
    # Commit the changes
    session.commit()
    # Show results in logs
    context.log.info(f"Deleted {deleted_event.rowcount} event logs and {deleted_run.rowcount} run logs older than {cutoff_date}")

@op(required_resource_keys={"met_etl_db_session"})
def vacuum_met_etl_schema(context):
    session = context.resources.met_etl_db_session
    # Vacuum the schema to reclaim space
    session.execute("VACUUM ANALYZE dagster.*")
    # Remove deleted rows from the indexes
    session.execute("REINDEX SCHEMA dagster")