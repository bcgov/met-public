from dagster import op
from datetime import datetime, timedelta, timezone

MAX_AGE_DAYS = 45  # Define the maximum age of logs to keep (in days)

@op(required_resource_keys={"met_db_session"})
def cleanup_old_event_and_run_logs(context):
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)
    session = context.resources.met_db_session

    # Log start of operation
    context.log.info(f"Starting cleanup of logs older than {cutoff_date}")

    # Delete event logs with progress logging
    context.log.info("Starting event logs cleanup...")
    deleted_event = session.execute(
        """
        DELETE FROM dagster.event_logs WHERE timestamp < :cutoff_date
        """,
        {"cutoff_date": cutoff_date}
    )
    context.log.info(f"Deleted {deleted_event.rowcount} event log records")

    # Delete run logs with progress logging
    context.log.info("Starting run logs cleanup...")
    deleted_run = session.execute(
        """
        DELETE FROM dagster.runs WHERE update_timestamp < :cutoff_date
        """,
        {"cutoff_date": cutoff_date}
    )
    context.log.info(f"Deleted {deleted_run.rowcount} run records")

    # Commit the changes
    session.commit()
    context.log.info("Cleanup completed successfully")

@op(required_resource_keys={"met_db_session"})
def vacuum_met_db_schema(context):
    session = context.resources.met_db_session
    start_time = datetime.now(timezone.utc)

    context.log.info("Starting schema maintenance...")

    try:
        # Log vacuum start
        context.log.info("Starting VACUUM ANALYZE...")
        vacuum_start = datetime.now(timezone.utc)

        cmd = session.execute(
            """
            SELECT format('VACUUM ANALYZE %I.%I;', table_schema, table_name)
            FROM information_schema.tables
            WHERE table_schema = 'dagster';
            """
        ).scalars().all()

        for i, command in enumerate(cmd, start=1):
            # Log each command being executed
            context.log.info(f"Executing: {command} ({i/len(cmd)})")
            # Execute the command
            session.execute(command[0])

        vacuum_duration = datetime.now(timezone.utc) - vacuum_start
        context.log.info(
            f"VACUUMed {len(cmd)} tables in {vacuum_duration.total_seconds():.2f} seconds"
        )
        # Log reindex start
        context.log.info("Starting REINDEX...")
        reindex_start = datetime.now(timezone.utc)

        # REINDEX SCHEMA cannot run inside a transaction block, so use autocommit
        connection = session.connection()
        raw_connection = connection.connection
        old_isolation_level = raw_connection.isolation_level
        try:
            raw_connection.set_isolation_level(0)  # autocommit mode
            cursor = raw_connection.cursor()
            cursor.execute("REINDEX SCHEMA dagster;")
            cursor.close()
        finally:
            raw_connection.set_isolation_level(old_isolation_level)

        reindex_duration = datetime.now(timezone.utc) - reindex_start
        context.log.info(
            f"REINDEX completed in {reindex_duration.total_seconds():.2f} seconds"
        )

        total_duration = datetime.now(timezone.utc) - start_time
        context.log.info(
            f"Schema maintenance completed in {total_duration.total_seconds():.2f} seconds"
        )

    except Exception as e:
        context.log.error(f"Error during schema maintenance: {str(e)}")
        raise