from dagster import Out, Output, op
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from utils.config import get_met_db_creds, get_met_analytics_db_creds
from datetime import datetime

from met_cron.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from met_api.models.submission import Submission as MetSubmissionModel
from met_api.models.survey import Survey as MetSurveyModel
from met_api.models.user import User as UserModel
from met_cron.models.response_type_radio import ResponseTypeRadio as ResponseTypeRadioModel
from met_cron.models.response_type_selectbox import ResponseTypeSelectbox as ResponseTypeSelectboxModel
from met_cron.models.response_type_textarea import ResponseTypeTextarea as ResponseTypeTextareaModel
from met_cron.models.response_type_option import ResponseTypeOption as ResponseTypeOptionModel
from met_cron.models.user_response_detail import UserResponseDetail as UserResponseDetailModel
from met_cron.models.survey import Survey as EtlSurveyModel
from met_cron.utils import FormIoComponentType

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

# get the last run cycle id for submission etl
@op(out={"submission_last_run_cycle_time": Out(), "submission_new_runcycleid": Out()})
def get_submission_last_run_cycle_time(context, flag_to_run_submission_etl):
    met_etl_db_session = _get_met_etl_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)

    submission_last_run_cycle_time = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'submission', EtlRunCycleModel.success == True).first()

    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in submission_last_run_cycle_time:

        for run_cycle_id in max_run_cycle_id:

            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(EtlRunCycleModel(id=new_run_cycle_id, packagename='submission', startdatetime=datetime.utcnow(), 
                        enddatetime=None, description='started the load for tables user response detail and responses', success=False))
            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(submission_last_run_cycle_time, "submission_last_run_cycle_time")

    yield Output(new_run_cycle_id, "submission_new_runcycleid")

# extract the submissions that have been created or updated after the last run
@op(out={"new_submission": Out(), "updated_submission": Out(), "submission_new_runcycleid": Out()})
def extract_submission(context, submission_last_run_cycle_time, submission_new_runcycleid):
    session = _get_met_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_submission = []
    updated_submission = []

    for last_run_cycle_time in submission_last_run_cycle_time:

        context.log.info("started extracting new data from submission table")
        new_submission = session.query(MetSubmissionModel).filter(MetSubmissionModel.created_date > last_run_cycle_time).all()

        if last_run_cycle_time > default_datetime:

            context.log.info("started extracting updated data from submission table")
            updated_submission = session.query(MetSubmissionModel).filter(MetSubmissionModel.updated_date > 
                                last_run_cycle_time, MetSubmissionModel.updated_date != MetSubmissionModel.created_date).all()

    yield Output(new_submission, "new_submission")

    yield Output(updated_submission, "updated_submission")

    yield Output(submission_new_runcycleid, "submission_new_runcycleid")

    context.log.info("completed extracting data from submission table")

    session.commit()

    session.close()

# load the sumissions created or updated after last run to the analytics database
@op(out={"submission_new_runcycleid": Out()})
def load_submission(context, new_submission, updated_submission, submission_new_runcycleid):
    all_submissions = new_submission + updated_submission
    metsession = _get_met_session()
    metetlsession = _get_met_etl_session()

    if len(all_submissions) > 0:

        context.log.info("loading new submissions")

        for submission in all_submissions:

            met_survey = metsession.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            etl_survey = metetlsession.query(EtlSurveyModel).filter(EtlSurveyModel.source_survey_id == submission.survey_id,
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

            form_questions = met_survey.form_json.get('components', None)

            if (form_questions) is None:
                # throw error or notify by logging
                context.log.info(
                    'Survey Found without any component in form_json: %s.Skipping it',
                    met_survey.id)
                continue

            user = metsession.query(UserModel).filter(UserModel.id == submission.user_id).first()

            context.log.info('User : %s Found for submission id : %s with mappedd user id %s', user,
                            submission.id, submission.user_id)

            for component in form_questions:
                # go thru each component type and check for answer in the submission_json.
                # instead of going through each answer and iterate , we find the questions from the form and try to get the answer.
                answer_key = submission.submission_json.get(component['key'])

                if not (answer_key):
                    continue

                component_type = component['inputType'].lower()
                context.log.info('Type for submission id : %s. is %s ', submission.id, component_type)

                if component_type == FormIoComponentType.RADIO.value:
                    _save_radio(metetlsession, context, answer_key, component, etl_survey, user, submission, submission_new_runcycleid)
                elif component_type == FormIoComponentType.CHECKBOX.value:
                    _save_checkbox(metetlsession, context, answer_key, component, etl_survey, user, submission, submission_new_runcycleid)
                elif component_type == FormIoComponentType.TEXT.value:
                    _save_text(metetlsession, context, etl_survey, component, answer_key, user, submission, submission_new_runcycleid)
                else:
                    context.log.info('No Mapping Found for .Type for submission id : %s. is %s .Skipping',
                                    submission.id, component_type)
                context.log.info(
                    '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Extraction Done for Submission id %s . Survey : %s.',
                    submission.id, met_survey.id)
				
                metetlsession.commit()
                    
    metsession.close()

    metetlsession.close()

    yield Output(submission_new_runcycleid, "submission_new_runcycleid")

# load data to table response_type_textarea
def _save_text(metetlsession, context, survey, component, answer_key, user, submission, submission_new_runcycleid):
    # text answer is a string.so value has to be found from question
    context.log.info('Input type  ResponseTypeTextModel is created:survey id: %s. '
                    'request_key is %s value:%s request_id:%s', survey.id, component['key'], answer_key,
                    component['id'])

    model_type = ResponseTypeTextareaModel(
        survey_id=survey.id,
        request_key=component['key'],
        value=answer_key,
        request_id=component['id'],
        user_id=getattr(user, 'id', None),
        is_active=True,
        runcycle_id=submission_new_runcycleid,
        created_date = submission.created_date,
        updated_date = submission.updated_date
    )

    metetlsession.add(model_type)

# load data to table response_type_radio
def _save_radio(metetlsession, context, answer_key, component, survey, user, submission, submission_new_runcycleid):

    # radio answer is a key.so value has to be found from question
    context.log.info('Input type ResponseTypeRadioModel is created:survey id: %s. '
                            'request_key is %s ', survey.id, component['key'])
    answer_key_str = str(answer_key)
    answer = next((x for x in component.get('values') if x.get('value') == answer_key_str), None)

    if not answer:
        return

    answer_value = answer.get('label')
    context.log.info('Input type  ResponseTypeRadioModel is created:survey id: %s. '
                            'request_key is %s value:%s request_id:%s', survey.id, component['key'],
                            answer_value,
                            component['id'])

    radio_response = ResponseTypeRadioModel(
        survey_id=survey.id,
        request_key=component['key'],
        value=answer_value,
        request_id=component['id'],
        user_id=getattr(user, 'id', None),
        is_active=True,
        runcycle_id=submission_new_runcycleid,
        created_date = submission.created_date,
        updated_date = submission.updated_date
    )

    metetlsession.add(radio_response) 

    _save_options(metetlsession, survey, component, answer_value, getattr(user, 'id', None), submission_new_runcycleid, submission) 

# load data to table response_type_selectbox
def _save_checkbox(metetlsession, context, answer_key, component, survey, user, submission, submission_new_runcycleid):
    # selectbox answer(answer_key) is a list.so values have to be found from question
    # answers is another dict if the question is simple chekboxes
    context.log.info('Input type  ResponseTypeSelectboxModel is created:survey id: %s. '
                    'request_key is %s  Answer Key %s', survey.id, component['key'], answer_key)

    selectbox_mapping = {}

    for item in component.get('values'):

        selectbox_mapping[item.get('value')] = item.get('label')

    for key, value in answer_key.items():
        # each answer is a row for simplebox.It belongs to answer in a multiple checkbox
        is_yes = _is_truthy(value)

        if is_yes:
            # need to find the label of the drop down.
            answer_label = selectbox_mapping.get(key)

            context.log.info('Input type  ResponseTypeSelectboxModel is created:survey id: %s. '
                            'request_key is %s value:%s request_id:%s', survey.id, component['key'],
                            answer_label,
                            component['id'])
                            
            selectbox_response = ResponseTypeSelectboxModel(
                survey_id=survey.id,
                request_key=component['key'],
                value=answer_label,
                request_id=component['id'],
                user_id=getattr(user, 'id', None),
                is_active=True,
                runcycle_id=submission_new_runcycleid,
                created_date = submission.created_date,
                updated_date = submission.updated_date
                )

            metetlsession.add(selectbox_response)

            _save_options(metetlsession, survey, component, answer_label, getattr(user, 'id', None), submission_new_runcycleid, submission) 

# load data to table response_type_option
def _save_options(metetlsession, survey, component, value, user, submission_new_runcycleid, submission):
    radio_response = ResponseTypeOptionModel(
        survey_id=survey.id,
        request_key=component['key'],
        value=value,
        request_id=component['id'],
        user_id=user,
        is_active=True,
        runcycle_id=submission_new_runcycleid,
        created_date = submission.created_date,
        updated_date = submission.updated_date
    )

    metetlsession.add(radio_response)   

def _is_truthy(answer):
    if type(answer) == 'str':
        is_yes = answer.casefold() == 'yes' or answer.casefold() == 'true'
    else:
        is_yes = answer is True
    return is_yes

# load the sumissions created or updated after last run to the user response details in analytics database
@op(out={"submission_new_runcycleid": Out()})
def load_user_response_details(context, new_submission, updated_submission, submission_new_runcycleid):
    session = _get_met_etl_session()

    metsession = _get_met_session()

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
                        engagement_id = met_survey.engagement_id,
                        user_id = submission.user_id,
                        is_active=True,
                        runcycle_id=submission_new_runcycleid,
                        created_date = submission.created_date,
                        updated_date = submission.updated_date
                    )

            session.add(user_response_detail)

            session.commit()

    metsession.close()	

    session.close()	

    yield Output(submission_new_runcycleid, "submission_new_runcycleid")

# update the status for submission etl in run cycle table as successful
@op(out={"flag_to_run_step_after_submission": Out()})
def submission_end_run_cycle(context, submission_new_runcycleid):
    met_etl_db_session = _get_met_etl_session()

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == submission_new_runcycleid, EtlRunCycleModel.packagename == 'submission', 
        EtlRunCycleModel.success == False).update({'success': True, 
        'description': 'ended the load for tables user response detail and responses'})

    context.log.info("run cycle ended for submission table")

    met_etl_db_session.commit()

    met_etl_db_session.close() 

    yield Output("submission", "flag_to_run_step_after_submission")