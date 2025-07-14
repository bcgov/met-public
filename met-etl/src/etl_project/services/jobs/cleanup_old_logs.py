from dagster import job
from ops.cleanup_logs_service import cleanup_old_event_and_run_logs
from ops.cleanup_logs_service import vacuum_met_etl_schema
from resources.db import met_db_session, met_etl_db_session

@job(resource_defs={"met_db_session": met_db_session, "met_etl_db_session": met_etl_db_session})
def cleanup_old_logs():
    cleanup_old_event_and_run_logs()

@job(resource_defs={"met_etl_db_session": met_etl_db_session})
def vacuum_met_etl():
    vacuum_met_etl_schema()
