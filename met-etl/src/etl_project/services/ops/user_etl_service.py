from dagster import Out, Output, op
from met_api.models.user import User as MetUserModel
from met_cron.models.user_details import UserDetails as UserDetailsModel
from met_cron.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from utils.config import get_met_db_creds, get_met_analytics_db_creds
from datetime import datetime, timedelta


@op(out={"last_cycle_time": Out(is_required=True)})
def get_user_details_last_run_cycle_time(context):
    met_etl_db_session = _get_met_etl_session()
    default_datetime = datetime(1900, 1, 1, 15, 59, 56, 721228)
    user_details_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'userdetails', EtlRunCycleModel.success == True).first()
    yield Output(user_details_last_run_cycle_datetime, "last_cycle_time")
    for lastruncycledatetime in user_details_last_run_cycle_datetime:
        if lastruncycledatetime == default_datetime:
            context.log.info("No record found in run cycle table")
            met_etl_db_session.add(
                EtlRunCycleModel(id=1, packagename='userdetails', startdatetime=datetime.utcnow(), enddatetime=None,
                                 description='started the load for user_details table', success=False))
        if lastruncycledatetime != default_datetime:
            context.log.info("Latest record found in run cycle table")
            for lastruncycledatetime in user_details_last_run_cycle_datetime:
                user_details_last_run_cycle_id = met_etl_db_session.query(EtlRunCycleModel.id).filter(
                    EtlRunCycleModel.enddatetime == lastruncycledatetime).first()
                for lastruncycleid in user_details_last_run_cycle_id:
                    new_run_cycle_id = lastruncycleid + 1
                    met_etl_db_session.add(EtlRunCycleModel(id=new_run_cycle_id, packagename='userdetails',
                                                            startdatetime=datetime.utcnow(), enddatetime=None,
                                                            description='started the load for user_details table',
                                                            success=False))
    met_etl_db_session.commit()
    met_etl_db_session.close()


@op(out={"newusers": Out(is_required=True)})
def extract_user(context, last_cycle_time):
    session = _get_met_session()
    new_users = session.query(MetUserModel).filter(MetUserModel.created_date > last_cycle_time).all()
    context.log.info(new_users)
    yield Output(new_users, "newusers")
    session.commit()
    session.close()


def _get_met_session():
    engine = get_met_db_creds()
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


def _get_met_etl_session():
    engine = get_met_analytics_db_creds()
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


@op
def load_new_user(context, newusers):
    session = _get_met_etl_session()
    for user in newusers:
        user_model = UserDetailsModel(name=user.external_id, is_active=True, created_date=user.created_date,
                                     updated_date=user.updated_date, runcycle_id=1)
        session.add(user_model)
        session.commit()
    session.close()
