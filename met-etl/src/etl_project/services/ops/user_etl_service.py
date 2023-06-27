from dagster import Out, Output, op
from sqlalchemy import func
from datetime import datetime

from met_api.models.participant import Participant as ParticipantModel
from analytics_api.models.user_details import UserDetails as UserDetailsModel
from analytics_api.models.etlruncycle import EtlRunCycle as EtlRunCycleModel


# get the last run cycle id for user detail etl
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"user_details_last_run_cycle_datetime": Out(), "user_details_new_run_cycle_id": Out()})
def get_user_last_run_cycle_time(context):
    met_etl_db_session = context.resources.met_etl_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)

    user_details_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'userdetails', EtlRunCycleModel.success == True).first()

    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in user_details_last_run_cycle_datetime:

        for run_cycle_id in max_run_cycle_id:
            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(
                EtlRunCycleModel(id=new_run_cycle_id, packagename='userdetails', startdatetime=datetime.utcnow(),
                                 enddatetime=None, description='started the load for table user_details',
                                 success=False))
            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(user_details_last_run_cycle_datetime, "user_details_last_run_cycle_datetime")

    yield Output(new_run_cycle_id, "user_details_new_run_cycle_id")


# extract the users that have been created or updated after the last run
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"new_participants": Out(), "updated_participants": Out(), "user_details_new_run_cycle_id": Out()})
def extract_participant(context, user_details_last_run_cycle_datetime, user_details_new_run_cycle_id):
    session = context.resources.met_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_participants = []
    updated_participants = []

    for last_run_cycle_time in user_details_last_run_cycle_datetime:

        context.log.info("started extracting new data from user_details table")
        new_participants = session.query(ParticipantModel).filter(ParticipantModel.created_date > last_run_cycle_time).all()

        if last_run_cycle_time > default_datetime:
            context.log.info("started extracting updated data from user_details table")
            updated_participants = session.query(ParticipantModel).filter(ParticipantModel.updated_date > last_run_cycle_time,
                                                               ParticipantModel.updated_date != ParticipantModel.created_date).all()

    yield Output(new_participants, "new_participants")

    yield Output(updated_participants, "updated_participants")

    yield Output(user_details_new_run_cycle_id, "user_details_new_run_cycle_id")

    context.log.info("completed extracting data from user_details table")

    session.commit()

    session.close()


# load the users created or updated after last run to the analytics database
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"user_details_new_run_cycle_id": Out()})
def load_user(context, new_participants, updated_participants, user_details_new_run_cycle_id):
    session = context.resources.met_etl_db_session
    all_participants = new_participants + updated_participants

    if len(all_participants) > 0:

        context.log.info("loading new participants")

        for participant in all_participants:
            session.query(UserDetailsModel).filter(UserDetailsModel.name == participant.email_address).update(
                {'is_active': False})
            user_model = UserDetailsModel(name=participant.email_address, is_active=True, created_date=participant.created_date,
                                          updated_date=participant.updated_date, runcycle_id=user_details_new_run_cycle_id)

            session.add(user_model)

            session.commit()

    yield Output(user_details_new_run_cycle_id, "user_details_new_run_cycle_id")

    context.log.info("completed loading user_details table")

    session.close()


# update the status for user detail etl in run cycle table as successful
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"flag_to_run_step_after_user": Out()})
def user_end_run_cycle(context, user_details_new_run_cycle_id):
    met_etl_db_session = context.resources.met_etl_db_session

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == user_details_new_run_cycle_id, EtlRunCycleModel.packagename == 'userdetails',
        EtlRunCycleModel.success == False).update(
        {'success': True, 'enddatetime': datetime.utcnow(), 'description': 'ended the load for table user_details'})

    context.log.info("run cycle ended for user_details table")

    yield Output("userdetails", "flag_to_run_step_after_user")

    met_etl_db_session.commit()

    met_etl_db_session.close()
