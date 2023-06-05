from dagster import Out, Output, op
from sqlalchemy import func
from datetime import datetime

from met_api.models.email_verification import EmailVerification as MetEmailVerificationModel
from met_api.models.survey import Survey as MetSurveyModel
from analytics_api.models.email_verification import EmailVerification as EtlEmailVerificationModel
from analytics_api.models.etlruncycle import EtlRunCycle as EtlRunCycleModel


# get the last run cycle id for email verification etl
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"email_ver_last_run_cycle_datetime": Out(), "email_ver_new_run_cycle_id": Out()})
def get_email_ver_last_run_cycle_time(context, flag_to_run_step_after_submission):
    met_etl_db_session = context.resources.met_etl_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)

    email_ver_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'emailverification', EtlRunCycleModel.success == True).first()

    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in email_ver_last_run_cycle_datetime:

        for run_cycle_id in max_run_cycle_id:
            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(
                EtlRunCycleModel(id=new_run_cycle_id, packagename='emailverification', startdatetime=datetime.utcnow(),
                                 enddatetime=None, description='started the load for table email_verification',
                                 success=False))
            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(email_ver_last_run_cycle_datetime, "email_ver_last_run_cycle_datetime")

    yield Output(new_run_cycle_id, "email_ver_new_run_cycle_id")


# extract the email verification data that has been created or updated after the last run
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"new_email_ver": Out(), "updated_email_ver": Out(), "email_ver_new_run_cycle_id": Out()})
def extract_email_ver(context, email_ver_last_run_cycle_datetime, email_ver_new_run_cycle_id):
    session = context.resources.met_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_email_ver = []
    updated_email_ver = []

    for last_run_cycle_time in email_ver_last_run_cycle_datetime:

        context.log.info("started extracting new data from email_verification table")
        new_email_ver = session.query(MetEmailVerificationModel).filter(
            MetEmailVerificationModel.created_date > last_run_cycle_time).all()

        if last_run_cycle_time > default_datetime:
            context.log.info("started extracting updated data from email_verification table")
            updated_email_ver = session.query(MetEmailVerificationModel).filter(
                MetEmailVerificationModel.updated_date > last_run_cycle_time,
                MetEmailVerificationModel.updated_date != MetEmailVerificationModel.created_date).all()

    yield Output(new_email_ver, "new_email_ver")

    yield Output(updated_email_ver, "updated_email_ver")

    yield Output(email_ver_new_run_cycle_id, "email_ver_new_run_cycle_id")

    context.log.info("completed extracting data from email_verification table")

    session.commit()

    session.close()


# load the email verification created or updated after last run to the analytics database
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"email_ver_new_run_cycle_id": Out()})
def load_email_ver(context, new_email_ver, updated_email_ver, email_ver_new_run_cycle_id):
    met_session = context.resources.met_db_session
    session = context.resources.met_etl_db_session
    all_email_ver = new_email_ver + updated_email_ver

    if len(all_email_ver) > 0:

        context.log.info("loading new email verification")

        for email_ver in all_email_ver:
            session.query(EtlEmailVerificationModel).filter(
                EtlEmailVerificationModel.source_email_ver_id  == email_ver.id).update( 
                {'is_active': False})
            
            survey = met_session.query(MetSurveyModel).filter(MetSurveyModel.id == email_ver.survey_id).first()

            email_ver_model = EtlEmailVerificationModel(source_email_ver_id=email_ver.id,
                                                        is_active=True,
                                                        participant_id=email_ver.participant_id,
                                                        survey_id=email_ver.survey_id,
                                                        engagement_id=survey.engagement_id,
                                                        created_date=email_ver.created_date,
                                                        updated_date=email_ver.updated_date,
                                                        runcycle_id=email_ver_new_run_cycle_id)

            session.add(email_ver_model)

            session.commit()

    yield Output(email_ver_new_run_cycle_id, "email_ver_new_run_cycle_id")

    context.log.info("completed loading email_verification table")

    met_session.close()
    session.close()


# update the status for email verification etl in run cycle table as successful
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"flag_to_run_step_after_email_ver": Out()})
def email_ver_end_run_cycle(context, email_ver_new_run_cycle_id):
    met_etl_db_session = context.resources.met_etl_db_session

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == email_ver_new_run_cycle_id, EtlRunCycleModel.packagename == 'emailverification',
        EtlRunCycleModel.success == False).update(
        {'success': True, 'enddatetime': datetime.utcnow(), 'description': 'ended the load for table email_verification'})

    context.log.info("run cycle ended for email_verification table")

    yield Output("emailverification", "flag_to_run_step_after_email_ver")

    met_etl_db_session.commit()

    met_etl_db_session.close()
