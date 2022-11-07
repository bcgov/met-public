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

# get the last run cycle id for user detail etl
@op(out={"user_details_last_run_cycle_datetime": Out(), "user_details_new_run_cycle_id": Out()})
def get_user_details_last_run_cycle_time(context):
    met_etl_db_session = _get_met_etl_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)

    user_details_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'userdetails', EtlRunCycleModel.success == True).first()

    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in user_details_last_run_cycle_datetime:

        for run_cycle_id in max_run_cycle_id:

            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(EtlRunCycleModel(id=new_run_cycle_id, packagename='userdetails', startdatetime=datetime.utcnow(), 
                        enddatetime=None, description='started the load for table user_details', success=False))
            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(user_details_last_run_cycle_datetime, "user_details_last_run_cycle_datetime")

    yield Output(new_run_cycle_id, "user_details_new_run_cycle_id")

# extract the users that have been created or updated after the last run
@op(out={"new_users": Out(), "updated_users": Out(), "user_details_new_run_cycle_id": Out()})
def extract_user(context, user_details_last_run_cycle_datetime, user_details_new_run_cycle_id):
    session = _get_met_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_users = []
    updated_users = []

    for last_run_cycle_time in user_details_last_run_cycle_datetime:

        context.log.info("started extracting new data from user_details table")
        new_users = session.query(MetUserModel).filter(MetUserModel.created_date > last_run_cycle_time).all()

        if last_run_cycle_time > default_datetime:

            context.log.info("started extracting updated data from user_details table")
            updated_users = session.query(MetUserModel).filter(MetUserModel.updated_date > last_run_cycle_time, 
                                                            MetUserModel.updated_date!=MetUserModel.created_date).all()

    yield Output(new_users, "new_users")

    yield Output(updated_users, "updated_users")

    yield Output(user_details_new_run_cycle_id, "user_details_new_run_cycle_id")

    context.log.info("completed extracting data from user_details table")

    session.commit()

    session.close()

# load the users created or updated after last run to the analytics database
@op(out={"user_details_new_run_cycle_id": Out()})
def load_user(context, new_users, updated_users, user_details_new_run_cycle_id):
    session = _get_met_etl_session()
    all_users = new_users + updated_users

    if len(all_users) > 0:

        context.log.info("loading new users")

        for user in all_users:

            session.query(UserDetailsModel).filter(UserDetailsModel.name == user.external_id).update({'is_active': False})
            user_model = UserDetailsModel(name=user.external_id, is_active=True, created_date=user.created_date,
                                        updated_date=user.updated_date, runcycle_id=user_details_new_run_cycle_id)

            session.add(user_model)

            session.commit()

    yield Output(user_details_new_run_cycle_id, "user_details_new_run_cycle_id")

    context.log.info("completed loading user_details table")

    session.close()

# update the status for user detail etl in run cycle table as successful
@op(out={"flag_to_run_step_after_user_details": Out()})
def user_details_end_run_cycle(context, user_details_new_run_cycle_id):
    met_etl_db_session = _get_met_etl_session()

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == user_details_new_run_cycle_id, EtlRunCycleModel.packagename == 'userdetails', 
        EtlRunCycleModel.success == False).update({'success': True, 'description': 'ended the load for table user_details'})

    context.log.info("run cycle ended for user_details table")

    yield Output("userdetails", "flag_to_run_step_after_user_details")

    met_etl_db_session.commit()
    
    met_etl_db_session.close()