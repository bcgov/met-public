from dagster import Out, Output, op
from sqlalchemy import func
from datetime import datetime

from analytics_api.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from met_api.models.submission import Submission as MetSubmissionModel
from met_api.models.survey import Survey as MetSurveyModel
from met_api.models.participant import Participant as ParticipantModel
from analytics_api.models.response_type_option import ResponseTypeOption as ResponseTypeOptionModel
from analytics_api.models.user_response_detail import UserResponseDetail as UserResponseDetailModel
from analytics_api.models.survey import Survey as EtlSurveyModel
from analytics_api.utils.util import FormIoComponentType


# Perform the ETL on submissions.
# 1.Extract data out of submission.
# 2.Iterate form_json.components.
# 3.Check Type and save to db

# get the last run cycle id for submission etl
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"submission_last_run_cycle_time": Out(), "submission_new_runcycleid": Out()})
def get_submission_last_run_cycle_time(context, flag_to_trigger_submission_etl):
    met_etl_db_session = context.resources.met_etl_db_session
    # default date to load the whole data on first run
    default_datetime = datetime(2022, 8, 1, 0, 0, 0, 0)

    submission_last_run_cycle_time = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'submission', EtlRunCycleModel.success == True).first()

    # get the latest record id from the run cycle table, in case of first run its considered as zero
    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in submission_last_run_cycle_time:

        for run_cycle_id in max_run_cycle_id:
            # insert the current run cycle details to the table with the success status as false. 
            # This will be set to true once the job completes
            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(
                EtlRunCycleModel(id=new_run_cycle_id, packagename='submission', startdatetime=datetime.utcnow(),
                                 enddatetime=None,
                                 description='started the load for tables user response detail and responses',
                                 success=False))
            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(submission_last_run_cycle_time, "submission_last_run_cycle_time")

    yield Output(new_run_cycle_id, "submission_new_runcycleid")


# extract the submissions that have been created or updated after the last run
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"new_submission": Out(), "updated_submission": Out(), "submission_new_runcycleid": Out()})
def extract_submission(context, submission_last_run_cycle_time, submission_new_runcycleid):
    session = context.resources.met_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_submission = []
    updated_submission = []

    for last_run_cycle_time in submission_last_run_cycle_time:

        context.log.info("started extracting new data from submission table")
        new_submission = session.query(MetSubmissionModel).filter(
            MetSubmissionModel.created_date > last_run_cycle_time).all()

# commenting out the logic for updated submission, this is not needed as of now
#       if last_run_cycle_time > default_datetime:
#           context.log.info("started extracting updated data from submission table")
#           updated_submission = session.query(MetSubmissionModel).filter(MetSubmissionModel.updated_date >
#                                                                         last_run_cycle_time,
#                                                                         MetSubmissionModel.updated_date != MetSubmissionModel.created_date).all()

    yield Output(new_submission, "new_submission")

    yield Output(updated_submission, "updated_submission")

    yield Output(submission_new_runcycleid, "submission_new_runcycleid")

    context.log.info("completed extracting data from submission table")

    session.commit()

    session.close()


# load the sumissions created or updated after last run to the analytics database
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"submission_new_runcycleid": Out()})
def load_submission(context, new_submission, updated_submission, submission_new_runcycleid):
    all_submissions = new_submission + updated_submission
    metsession = context.resources.met_db_session
    met_etl_session = context.resources.met_etl_db_session
    # check if there are any new or updated records
    if len(all_submissions) > 0:

        context.log.info("loading new submissions")
        # go thru each submission.
        for submission in all_submissions:

            met_survey = metsession.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            etl_survey = met_etl_session.query(EtlSurveyModel).filter(
                EtlSurveyModel.source_survey_id == submission.survey_id,
                EtlSurveyModel.is_active == True).first()

            context.log.info(
                '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Extraction starting for Submission id %s . Survey : %s.',
                submission.id, met_survey.id)

            if not etl_survey or not met_survey:
                context.log.info(
                    '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Skipping Extraction  for Submission id %s . Survey Not Found in Analytics DB : %s.Probably a very old survey',
                    submission.id,
                    met_survey.id)
                continue

            form_type = met_survey.form_json.get('display', None)

            # check and load data for single page survey.
            if form_type == 'form':
                form_questions = met_survey.form_json.get('components', None)
                _extract_submission(form_questions, met_survey, metsession, submission, met_etl_session, context,
                                    submission_new_runcycleid, etl_survey)

            # check and load data for multi page survey.
            if form_type == 'wizard':
                pages = met_survey.form_json.get('components', None)
                for page in pages:
                    form_questions = page.get('components', None)
                    _extract_submission(form_questions, met_survey, metsession, submission, met_etl_session, context,
                                        submission_new_runcycleid, etl_survey)

    metsession.close()

    met_etl_session.close()

    yield Output(submission_new_runcycleid, "submission_new_runcycleid")


# load data to table response_type_textarea
def _extract_submission(form_questions, met_survey, metsession, submission, met_etl_session, context,
                        submission_new_runcycleid, etl_survey):
            if (form_questions) is None:
                # throw error or notify by logging
                context.log.info(
                    'Survey Found without any component in form_json: %s.Skipping it',
                    met_survey.id)
                return

            user = metsession.query(ParticipantModel).filter(ParticipantModel.id == submission.participant_id).first()

            context.log.info('User : %s Found for submission id : %s with mappedd user id %s', user,
                             submission.id, submission.participant_id)

            for component in form_questions:
                # go thru each component type and check for answer in the submission_json.
                # instead of going through each answer and iterate , we find the questions from the form and try to get the answer.
                answer_key = submission.submission_json.get(component['key'])

                if not (answer_key):
                    continue

                # TODO comments related to category type question has a different format in the source system
                # TODO the key needs to be finalized in the source system before doing a fix on the ETL.
                # for now excluding the comment for a category type question as we are not using this data for analytics.
                if component['key'] == 'categorycommentcontainer':
                    continue

                component_type = component['type'].lower()
                context.log.info('Type for submission id : %s. is %s ', submission.id, component_type)

                if component_type == FormIoComponentType.RADIO.value:
                    _save_radio(met_etl_session, context, answer_key, component, etl_survey, user, submission,
                                submission_new_runcycleid)
                elif component_type == FormIoComponentType.CHECKBOX.value:
                    _save_checkbox(met_etl_session, context, answer_key, component, etl_survey, user, submission,
                                   submission_new_runcycleid)
                elif component_type == FormIoComponentType.SELECTLIST.value:
                    _save_select(met_etl_session, context, answer_key, component, etl_survey, user, submission,
                                   submission_new_runcycleid)
                elif component_type == FormIoComponentType.SURVEY.value:
                    _save_survey(met_etl_session, context, answer_key, component, etl_survey, user, submission,
                                   submission_new_runcycleid)
                else:
                    context.log.info('No Mapping Found for .Type for submission id : %s. is %s .Skipping',
                                     submission.id, component_type)
                context.log.info(
                    '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Extraction Done for Submission id %s . Survey : %s.',
                    submission.id, met_survey.id)

                met_etl_session.commit()


# load responses for a radio type question
def _save_radio(met_etl_session, context, answer_key, component, survey, participant, submission, submission_new_runcycleid):
    # radio responses just has the key to the value selected, so value has to be found from question
    context.log.info('Input type Radio is created:survey id: %s. request_key is %s ',
                     survey.id, component['key'])
    answer_key_str = str(answer_key)
    answer = next((x for x in component.get('values') if x.get('value') == answer_key_str), None)

    if not answer:
        return

    answer_value = answer.get('label')
    context.log.info('Input type Radio is created:survey id: %s. request_key is %s value:%s request_id:%s',
                     survey.id, component['key'], answer_value, component['id'])

    _save_options(met_etl_session, survey, component, answer_value, getattr(participant, 'id', None),
                  submission_new_runcycleid, submission)


# load responses for a checkbox type question
def _save_checkbox(met_etl_session, context, answer_key, component, survey, participant, submission, submission_new_runcycleid):
    # checkbox responses just has the key to the value selected, so value has to be found from question
    context.log.info('Input type Selectbox is created:survey id: %s. request_key is %s  Answer Key %s',
                     survey.id, component['key'], answer_key)

    selectbox_mapping = {}

    if component.get('values') is not None:
        for item in component.get('values'):
            selectbox_mapping[item.get('value')] = item.get('label')

    if answer_key is not None:
        for key, value in answer_key.items():
            # each answer is a row for simplecheckboxes. It belongs to answer in a multiple checkbox
            is_yes = _is_truthy(value)

            if is_yes:
                # need to find the label of the drop down.
                answer_label = selectbox_mapping.get(key)

                context.log.info('Input type Selectbox is created:survey id: %s. '
                                 'request_key is %s value:%s request_id:%s', survey.id, component['key'],
                                 answer_label,
                                 component['id'])

                _save_options(met_etl_session, survey, component, answer_label, getattr(participant, 'id', None),
                              submission_new_runcycleid, submission)


# load responses for a select type question
def _save_select(met_etl_session, context, answer_key, component, survey, participant, submission, submission_new_runcycleid):
    # selected responses just has the key to the value selected, so value has to be found from question
    context.log.info('Input type Select is created:survey id: %s. request_key is %s ',
                     survey.id, component['key'])
    answer_key_str = str(answer_key)
    component_data = component.get('data')
    answer = next((x for x in component_data.get('values') if x.get('value') == answer_key_str), None)

    if not answer:
        return

    answer_value = answer.get('label')
    context.log.info('Input type Select is created:survey id: %s. request_key is %s value:%s request_id:%s',
                     survey.id, component['key'], answer_value, component['id'])

    _save_options(met_etl_session, survey, component, answer_value, getattr(participant, 'id', None),
                  submission_new_runcycleid, submission)


# load responses for a survey type question
def _save_survey(met_etl_session, context, answer_key, component, survey, participant, submission, submission_new_runcycleid):
    # selected survey just has the key to the value selected, so value has to be found from question
    context.log.info('Input type Survey is created:survey id: %s. request_key is %s ',
                     survey.id, component['key'])

    survey_mapping = {}

    if component.get('values') is not None:
        for item in component.get('values'):
            survey_mapping[item.get('value')] = item.get('label')

    if answer_key is not None:
        for key, value in answer_key.items():
            answer_label = survey_mapping.get(value)

            context.log.info('Input type Survey is created:survey id: %s. '
                             'request_key is %s value:%s request_id:%s', survey.id, component['key'],
                             answer_label, component['id'])

            # id for survey type question is same for all sub questions so request id is a combination of 
            # id and the key
            radio_response = ResponseTypeOptionModel(
                survey_id=survey.id,
                request_key=component['key'],
                value=answer_label,
                request_id=component['id']+'-'+key,
                participant_id=getattr(participant, 'id', None),
                is_active=True,
                runcycle_id=submission_new_runcycleid,
                created_date=submission.created_date,
                updated_date=submission.updated_date
            )

            met_etl_session.add(radio_response)


def _save_options(met_etl_session, survey, component, value, participant, submission_new_runcycleid, submission):
    radio_response = ResponseTypeOptionModel(
        survey_id=survey.id,
        request_key=component['key'],
        value=value,
        request_id=component['id'],
        participant_id=getattr(participant, 'id', None),
        is_active=True,
        runcycle_id=submission_new_runcycleid,
        created_date=submission.created_date,
        updated_date=submission.updated_date
    )

    met_etl_session.add(radio_response)


def _is_truthy(answer):
    if type(answer) == 'str':
        is_yes = answer.casefold() == 'yes' or answer.casefold() == 'true'
    else:
        is_yes = answer is True
    return is_yes


# load the sumissions created or updated after last run to the user response details in analytics database
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"submission_new_runcycleid": Out()})
def load_user_response_details(context, new_submission, updated_submission, submission_new_runcycleid):
    session = context.resources.met_etl_db_session

    metsession = context.resources.met_db_session

    all_submissions = new_submission + updated_submission

    if len(all_submissions) > 0:

        for submission in all_submissions:

            met_survey = metsession.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            etl_survey = session.query(EtlSurveyModel).filter(EtlSurveyModel.source_survey_id == submission.survey_id,
                                                              EtlSurveyModel.is_active == True).first()
            context.log.info(
                '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<User Response Detail Extraction starting for Submission id %s . Survey : %s.',
                submission.id, met_survey.id)
            # submission without survey is probably an old updated survey not beiing loaded to analytics db.Wont happen in prod
            if not etl_survey or not met_survey:
                context.log.info(
                    '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Skipping User Response Detail Extraction  for Submission id %s . Survey Not Found in Analytics DB : %s.Probably a very old survey',
                    submission.id,
                    met_survey.id)
                continue

            context.log.info('Creating new UserResponseDetailModel in Analytics DB: %s.', submission.id)

            user_response_detail = UserResponseDetailModel(
                survey_id=etl_survey.id,
                engagement_id=met_survey.engagement_id,
                participant_id=submission.participant_id,
                is_active=True,
                runcycle_id=submission_new_runcycleid,
                created_date=submission.created_date,
                updated_date=submission.updated_date
            )

            session.add(user_response_detail)

            session.commit()

    metsession.close()

    session.close()

    yield Output(submission_new_runcycleid, "submission_new_runcycleid")


# update the status for submission etl in run cycle table as successful
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"flag_to_run_step_after_submission": Out()})
def submission_end_run_cycle(context, submission_new_runcycleid):
    met_etl_db_session = context.resources.met_etl_db_session

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == submission_new_runcycleid, EtlRunCycleModel.packagename == 'submission',
        EtlRunCycleModel.success == False).update({'success': True, 'enddatetime': datetime.utcnow(),
                                                   'description': 'ended the load for tables user response detail and responses'})

    context.log.info("run cycle ended for submission table")

    met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output("submission", "flag_to_run_step_after_submission")
