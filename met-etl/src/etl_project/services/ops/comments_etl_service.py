from dagster import Out, Output, op
from sqlalchemy import func
from datetime import datetime

from met_api.models.comment import Comment as MetCommentModel
from met_api.constants.comment_status import Status as CommentStatus
from met_cron.models.user_feedback import UserFeedback as UserFeedbackModel
from met_cron.models.survey import Survey as EtlSurveyModel
from met_cron.models.etlruncycle import EtlRunCycle as EtlRunCycleModel


# get the last run cycle id for comments etl
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"comments_last_run_cycle_datetime": Out(), "comments_new_run_cycle_id": Out()})
def get_comments_last_run_cycle_time(context, flag_to_trigger_comments_etl):
    met_etl_db_session = context.resources.met_etl_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)

    comments_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'userfeedback', EtlRunCycleModel.success == True).first()

    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in comments_last_run_cycle_datetime:

        for run_cycle_id in max_run_cycle_id:
            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(
                EtlRunCycleModel(id=new_run_cycle_id, packagename='userfeedback', startdatetime=datetime.utcnow(),
                                 enddatetime=None, description='started the load for table user_feedback',
                                 success=False))

            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(comments_last_run_cycle_datetime, "comments_last_run_cycle_datetime")

    yield Output(new_run_cycle_id, "comments_new_run_cycle_id")


# extract the comments that have been created after the last run
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},out={"new_comments": Out(), "comments_new_run_cycle_id": Out()})
def extract_comments(context, comments_last_run_cycle_datetime, comments_new_run_cycle_id):
    session = context.resources.met_db_session
    new_comments = []

    for last_run_cycle_time in comments_last_run_cycle_datetime:
        context.log.info("started extracting new data from comments table")
        new_comments = session.query(MetCommentModel).filter(MetCommentModel.submission_date > last_run_cycle_time,
                                                             MetCommentModel.status_id == CommentStatus.Approved.value).all()

    yield Output(new_comments, "new_comments")

    yield Output(comments_new_run_cycle_id, "comments_new_run_cycle_id")

    context.log.info("completed extracting data from comments table")

    session.commit()

    session.close()


# load the comments created after last run to the analytics database
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},out={"comments_new_run_cycle_id": Out()})
def load_comments(context, new_comments, comments_new_run_cycle_id):
    session = context.resources.met_etl_db_session

    if len(new_comments) > 0:

        context.log.info("loading new comments")

        for comment in new_comments:

            etl_survey = session.query(EtlSurveyModel.id).filter(EtlSurveyModel.source_survey_id == comment.survey_id,
                                                                 EtlSurveyModel.is_active == True).first()

            for survey in etl_survey:
                context.log.info('Survey id in Analytics DB: %s  for Comment: %s with source survey id:%s:', comment.id,
                                 survey, comment.survey_id)

                user_feedback_model = UserFeedbackModel(survey_id=survey,
                                                        user_id=comment.user_id,
                                                        comment=comment.text,
                                                        source_comment_id=comment.id,
                                                        is_active=True,
                                                        created_date=comment.submission_date,
                                                        updated_date=None,
                                                        runcycle_id=comments_new_run_cycle_id)

                session.add(user_feedback_model)

                session.commit()

    yield Output(comments_new_run_cycle_id, "comments_new_run_cycle_id")

    context.log.info("completed loading comments table")

    session.close()


# update the status for comments etl in run cycle table as successful
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},out={"flag_to_run_step_after_comments": Out()})
def comments_end_run_cycle(context, comments_new_run_cycle_id):
    met_etl_db_session = context.resources.met_etl_db_session

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == comments_new_run_cycle_id, EtlRunCycleModel.packagename == 'userfeedback',
        EtlRunCycleModel.success == False).update(
        {'success': True, 'enddatetime': datetime.utcnow(), 'description': 'ended the load for table user_feedback'})

    context.log.info("run cycle ended for comments table")

    yield Output("userfeedback", "flag_to_run_step_after_comments")

    met_etl_db_session.commit()

    met_etl_db_session.close()
