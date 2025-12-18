# pylint: disable=import-outside-toplevel
import sys
from pathlib import Path

from dagster import repository

# Ensure the project root stays on sys.path when Dagster starts from /etl_project/services.
# We add both the build path (/opt/dagster/app) and the legacy symlink (/etl_project) to
# cover how the container is launched in different environments.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
LEGACY_ROOT = Path("/etl_project")
for candidate in (PROJECT_ROOT, LEGACY_ROOT):
    if candidate.exists():
        candidate_str = str(candidate)
        if candidate_str not in sys.path:
            sys.path.insert(0, candidate_str)

from etl_project.services.jobs.met_data_ingestion import met_data_ingestion
from etl_project.services.jobs.test_db import job_sample_db_test
from etl_project.services.jobs.cleanup_old_logs import cleanup_old_logs, vacuum_met_db
from etl_project.services.schedules.met_data_ingestion_schedule import (
    met_data_ingestion_schedule,
)
from etl_project.services.schedules.cleanup_old_logs_schedule import (
    cleanup_old_logs_schedule,
    vacuum_met_db_schedule,
)


@repository
def etl_project():
    return [job_sample_db_test,
            met_data_ingestion, met_data_ingestion_schedule,
            cleanup_old_logs, cleanup_old_logs_schedule,
            vacuum_met_db, vacuum_met_db_schedule]
