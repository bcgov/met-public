from dagster import job
from ops.user_etl_service import extract_user_data, load_user_data

@job
def met_data_ingestion():
    load_user_data(extract_user_data())
