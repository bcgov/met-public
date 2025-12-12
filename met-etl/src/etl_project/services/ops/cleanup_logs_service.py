from dagster import op
from datetime import datetime, timezone, timedelta

MAX_AGE_DAYS = 120  # Define the maximum age of logs to keep (in days)


@op(required_resource_keys={"dagster_db_session"})
def cleanup_old_event_and_run_logs(context):
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)
    session = context.resources.dagster_db_session

    context.log.info(
        "[Cleanup] Starting cleanup of logs older than "
        f"{cutoff_date.isoformat()}")

    # Delete event logs with progress logging
    context.log.info(
        "[Cleanup] Deleting from dagster.event_logs where timestamp < "
        f"{cutoff_date.isoformat()}")
    deleted_event = session.execute(
        """
        DELETE FROM dagster.event_logs WHERE timestamp < :cutoff_date
        """,
        {"cutoff_date": cutoff_date}
    )
    if deleted_event.rowcount:
        context.log.info(
            f"[Cleanup] Deleted {deleted_event.rowcount} event log records")
    else:
        context.log.info("[Cleanup] No event log records deleted")

    # Delete run logs with progress logging
    context.log.info(
        "[Cleanup] Deleting from dagster.runs where update_timestamp < "
        f"{cutoff_date.isoformat()}")
    deleted_run = session.execute(
        """
        DELETE FROM dagster.runs WHERE update_timestamp < :cutoff_date
        """,
        {"cutoff_date": cutoff_date}
    )
    if deleted_run.rowcount:
        context.log.info(
            f"[Cleanup] Deleted {deleted_run.rowcount} run records")
    else:
        context.log.info("[Cleanup] No run records deleted")

    # Delete job ticks with progress logging
    context.log.info(
        "[Cleanup] Deleting from dagster.job_ticks where timestamp < "
        f"{cutoff_date.isoformat()}")
    deleted_job_ticks = session.execute(
        """
        DELETE FROM dagster.job_ticks WHERE timestamp < :cutoff_date
        """,
        {"cutoff_date": cutoff_date}
    )
    if deleted_job_ticks.rowcount:
        context.log.info(
            f"[Cleanup] Deleted {deleted_job_ticks.rowcount} job tick records")
    else:
        context.log.info("[Cleanup] No job tick records deleted")

    # Commit the changes
    session.commit()
    context.log.info("[Cleanup] Cleanup completed successfully")


@op(required_resource_keys={"dagster_db_session"})
def vacuum_met_db_schema(context):
    session = context.resources.dagster_db_session
    start_time = datetime.now(timezone.utc)

    context.log.info(
        "[Vacuum] Starting schema maintenance for 'dagster' schema")

    try:
        context.log.info(
            "[Vacuum] Starting VACUUM ANALYZE on all tables in 'dagster' schema...")
        vacuum_start = datetime.now(timezone.utc)

        cmd = session.execute(
            """
            SELECT format('VACUUM ANALYZE %I.%I;', table_schema, table_name)
            FROM information_schema.tables
            WHERE table_schema = 'dagster';
            """
        ).scalars().all()

        if not cmd:
            context.log.info(
                "[Vacuum] No tables found in 'dagster' schema to vacuum.")
        else:
            connection = session.connection()
            raw_connection = connection.connection
            old_isolation_level = raw_connection.isolation_level
            try:
                raw_connection.set_isolation_level(0)  # autocommit mode
                for i, command in enumerate(cmd, start=1):
                    context.log.info(
                        f"[Vacuum] Executing: {command} ({i}/{len(cmd)})")
                    session.execute(command)
            finally:
                raw_connection.set_isolation_level(old_isolation_level)

            vacuum_duration = datetime.now(timezone.utc) - vacuum_start
            context.log.info(
                f"[Vacuum] VACUUMed {len(cmd)} tables in "
                f"{vacuum_duration.total_seconds():.2f} seconds")

        context.log.info("[Vacuum] Starting REINDEX on 'dagster' schema...")
        reindex_start = datetime.now(timezone.utc)

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
            "[Vacuum] REINDEX completed in "
            f"{reindex_duration.total_seconds():.2f} seconds")

        total_duration = datetime.now(timezone.utc) - start_time
        context.log.info(
            "[Vacuum] Schema maintenance completed in "
            f"{total_duration.total_seconds():.2f} seconds")

    except Exception as e:
        context.log.error(
            "[Vacuum] Error during schema maintenance: "
            f"{str(e)}", exc_info=True
        )
        raise
