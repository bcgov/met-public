from dagster import job
from ops.user_etl_service import get_user_details_last_run_cycle_time, extract_user, load_new_user

@job
def met_data_ingestion():
    load_new_user(extract_user(get_user_details_last_run_cycle_time()))
