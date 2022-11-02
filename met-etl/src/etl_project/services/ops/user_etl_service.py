from dagster import Out, Output, op
from met_api.models.user import User as MetUserModel
from met_cron.models.user_details import UserDetails as UserDetailsModel
from met_cron.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from utils.config import get_met_db_creds, get_met_analytics_db_creds
from datetime import datetime, timedelta

@op(out={"userdetailslastruncycledatetime": Out(is_required=True)})
def get_user_details_last_run_cycle_datetime(context):
    metanalyticsdbengine = get_met_analytics_db_creds()
    Session = sessionmaker(bind=metanalyticsdbengine)
    metanalyticsdbsession = Session()
    defaultdatetime = datetime(1900, 1, 1, 15, 59, 56, 721228)
    user_details_last_run_cycle_datetime = metanalyticsdbsession.query(func.coalesce(func.max(EtlRunCycleModel.enddatetime), defaultdatetime)).filter(EtlRunCycleModel.packagename == 'userdetails', EtlRunCycleModel.success == True).first()
    yield Output(user_details_last_run_cycle_datetime, "userdetailslastruncycledatetime")
    for lastruncycledatetime in user_details_last_run_cycle_datetime:
        if lastruncycledatetime == defaultdatetime:
            context.log.info("No record found in run cycle table")
            metanalyticsdbsession.add(EtlRunCycleModel(id = 1, packagename = 'userdetails', startdatetime = datetime.utcnow(), enddatetime = None, description='started the load for user_details table', success = False))
        if lastruncycledatetime != defaultdatetime:
            context.log.info("Latest record found in run cycle table")
            for lastruncycledatetime in user_details_last_run_cycle_datetime:
                user_details_last_run_cycle_id = metanalyticsdbsession.query(EtlRunCycleModel.id).filter(EtlRunCycleModel.enddatetime == lastruncycledatetime).first()
                for lastruncycleid in user_details_last_run_cycle_id:
                    new_run_cycle_id = lastruncycleid + 1
                    metanalyticsdbsession.add(EtlRunCycleModel(id = new_run_cycle_id, packagename = 'userdetails', startdatetime = datetime.utcnow(), enddatetime = None, description='started the load for user_details table', success = False))
    metanalyticsdbsession.commit()
    metanalyticsdbsession.close()


@op(out={"newusers": Out(is_required=True)})
def extract_user(context, userdetailslastruncycledatetime):
    engine = get_met_db_creds()
    Session = sessionmaker(bind=engine)
    session = Session()
    new_users = session.query(MetUserModel).filter(MetUserModel.created_date > userdetailslastruncycledatetime).all()
    context.log.info(new_users)
    yield Output(new_users, "newusers")
    session.commit()
    session.close()

@op
def load_new_user(context, newusers):
    engine = get_met_analytics_db_creds()
    Session = sessionmaker(bind=engine)
    session = Session()
    for user in newusers:
        session.add(UserDetailsModel(name = user.external_id, is_active = True, created_date = user.created_date, updated_date = user.updated_date, runcycle_id = 1))
        session.commit()
    session.close()