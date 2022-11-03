from dagster import Out, Output, op
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from utils.config import get_met_db_creds, get_met_analytics_db_creds
from datetime import datetime

from met_api.models.user import User as MetUserModel
from met_cron.models.user_details import UserDetails as UserDetailsModel
from met_cron.models.etlruncycle import EtlRunCycle as EtlRunCycleModel

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

@op(out={"user_details_last_run_cycle_datetime": Out(), "userdetailsnewruncycleid": Out()})
def get_user_details_last_run_cycle_time(context):
    met_etl_db_session = _get_met_etl_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    user_details_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'userdetails', EtlRunCycleModel.success == True).first()
    for lastruncycledatetime in user_details_last_run_cycle_datetime:
        if lastruncycledatetime == default_datetime:
            context.log.info("No record found in run cycle table")
            new_run_cycle_id = 1
            met_etl_db_session.add(
                EtlRunCycleModel(id=new_run_cycle_id, packagename='userdetails', startdatetime=datetime.utcnow(), enddatetime=None,
                                 description='started the load for user_details table', success=False))
        if lastruncycledatetime != default_datetime:
            context.log.info("Latest record found in run cycle table")
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
    yield Output(user_details_last_run_cycle_datetime, "user_details_last_run_cycle_datetime")
    yield Output(new_run_cycle_id, "userdetailsnewruncycleid")

@op(out={"newusers": Out(), "updatedusers": Out(), "userdetailscurrentruncycleid": Out()})
def extract_user(context, user_details_last_run_cycle_datetime, userdetailsnewruncycleid):
    session = _get_met_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_users = []
    updated_users = []
    for lastcycletime in user_details_last_run_cycle_datetime:
        context.log.info("started extracting new data from user_details table")
        new_users = session.query(MetUserModel).filter(MetUserModel.created_date > lastcycletime).all()
        if lastcycletime > default_datetime:
            context.log.info("started extracting updated data from user_details table")
            updated_users = session.query(MetUserModel).filter(MetUserModel.updated_date > lastcycletime, MetUserModel.updated_date!=MetUserModel.created_date).all()
    yield Output(new_users, "newusers")
    yield Output(updated_users, "updatedusers")
    yield Output(userdetailsnewruncycleid, "userdetailscurrentruncycleid")
    context.log.info("completed extracting data from user_details table")
    session.commit()
    session.close()

@op(out={"userdetailscurrentruncycleid": Out()})
def load_user(context, newusers, updatedusers, userdetailsnewruncycleid):
    session = _get_met_etl_session()
    allusers = newusers + updatedusers
    if len(allusers) > 0:
        context.log.info("loading new users")
        for user in allusers:
            session.query(UserDetailsModel).filter(UserDetailsModel.name == user.external_id).update({'is_active': False})
            user_model = UserDetailsModel(name=user.external_id, is_active=True, created_date=user.created_date,
                                        updated_date=user.updated_date, runcycle_id=userdetailsnewruncycleid)
            session.add(user_model)
            session.commit()
    yield Output(userdetailsnewruncycleid, "userdetailscurrentruncycleid")
    context.log.info("completed loading user_details table")
    session.close()

@op(out={"engagementrunsequence": Out()})
def user_details_end_run_cycle(context, userdetailsnewruncycleid):
    met_etl_db_session = _get_met_etl_session()
    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == userdetailsnewruncycleid, EtlRunCycleModel.packagename == 'userdetails', 
        EtlRunCycleModel.success == False).update({'success': True, 'description': 'ended the load for user_details table'})
    context.log.info("run cycle ended for user_details table")
    yield Output(2, "engagementrunsequence")
    met_etl_db_session.commit()
    met_etl_db_session.close()