import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = PROJECT_ROOT / "src"
SERVICES_ROOT = SRC_ROOT / "etl_project" / "services"

# Ensure imports inside repo.py that use bare module names (e.g., jobs.*, ops.*)
# can resolve when running pytest directly.
for path in (SRC_ROOT, SERVICES_ROOT):
    if path.as_posix() not in sys.path:
        sys.path.insert(0, path.as_posix())

from etl_project.services.repo import etl_project

def test_repository_registers_expected_jobs_and_schedules():
    """Basic smoke test to ensure Dagster repository loads expected assets."""
    repo_def = etl_project()

    expected_jobs = {
        "met_data_ingestion",
        "job_sample_db_test",
        "cleanup_old_logs",
        "vacuum_met_db",
    }
    get_jobs = getattr(repo_def, "get_all_jobs", None) or getattr(repo_def, "get_all_pipelines", None)
    assert get_jobs, "Dagster RepositoryDefinition API unexpected: missing job accessor"
    job_names = {job.name for job in get_jobs()}
    assert expected_jobs.issubset(job_names)

    schedule_defs = (
        getattr(repo_def, "get_all_schedule_defs", None)
        or getattr(repo_def, "schedule_defs", None)
        or getattr(repo_def, "get_schedules", None)
    )
    assert schedule_defs, "Dagster RepositoryDefinition API unexpected: missing schedule accessor"
    schedule_iterable = schedule_defs() if callable(schedule_defs) else schedule_defs
    schedule_names = {schedule.name for schedule in schedule_iterable}
    # Some schedules are defined via ScheduleDefinition without an explicit name;
    # they default to the job name, so allow either form for those.
    assert "met_data_ingestion_schedule" in schedule_names
    assert {"cleanup_old_logs", "cleanup_old_logs_schedule"} & schedule_names
    assert {"vacuum_met_db", "vacuum_met_db_schedule"} & schedule_names
