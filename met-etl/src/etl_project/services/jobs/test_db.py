from dagster import job
from etl_project.services.ops.sample_db_service import run_sample_db_test
from etl_project.services.resources.db import engagement_db_session, etl_db_session


@job(resource_defs={"engagement_db_session": engagement_db_session,
     "etl_db_session": etl_db_session})
def job_sample_db_test():
    run_sample_db_test()
