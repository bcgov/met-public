from dagster import job
from ops.sample_db_service import run_sample_db_test

from resources.db import met_db_session, met_etl_db_session


@job(resource_defs={"met_db_session": met_db_session, "met_etl_db_session": met_etl_db_session})
def job_sample_db_test():
    run_sample_db_test()
