from dagster import Out, Output, op
from met_api.models.user import User as MetUserModel
from datetime import datetime
from analytics_api.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from sqlalchemy import func


@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"newusers": Out(is_required=True)})
def run_sample_db_test(context):
    """Verify Connect DB."""
    met_db_session = context.resources.met_db_session
    default_datetime = datetime(1900, 1, 1, 15, 59, 56, 721228)
    new_users = met_db_session.query(MetUserModel).filter(MetUserModel.created_date > default_datetime).all()
    context.log.info('MET DB')
    context.log.info(new_users)

    met_etl_db_session = context.resources.met_etl_db_session
    survey_last_run_cycle_time = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'survey', EtlRunCycleModel.success == True).first()

    context.log.info('MET ETL DB')
    context.log.info(survey_last_run_cycle_time)

    yield Output(new_users, "newusers")
