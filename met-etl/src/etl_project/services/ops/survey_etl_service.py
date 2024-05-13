from analytics_api.models.available_response_option import AvailableResponseOption as EtlAvailableResponseOption
from analytics_api.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from analytics_api.models.request_type_option import RequestTypeOption as EtlRequestTypeOption
from analytics_api.models.response_type_option import ResponseTypeOption as EtlResponseTypeOptionModel
from analytics_api.models.survey import Survey as EtlSurveyModel
from analytics_api.utils.util import FormIoComponentType
from dagster import Out, Output, op
from datetime import datetime
from met_api.models.survey import Survey as MetSurveyModel
from sqlalchemy import func


# get the last run cycle id for survey etl
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"survey_last_run_cycle_time": Out(), "survey_new_runcycleid": Out()})
def get_survey_last_run_cycle_time(context, flag_to_run_step_after_engagement):
    met_etl_db_session = context.resources.met_etl_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)

    survey_last_run_cycle_time = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'survey', EtlRunCycleModel.success == True).first()

    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in survey_last_run_cycle_time:

        for run_cycle_id in max_run_cycle_id:
            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(
                EtlRunCycleModel(id=new_run_cycle_id, packagename='survey', startdatetime=datetime.utcnow(),
                                 enddatetime=None, description='started the load for tables survey and requests',
                                 success=False))
            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(survey_last_run_cycle_time, "survey_last_run_cycle_time")

    yield Output(new_run_cycle_id, "survey_new_runcycleid")


# extract the surveys that have been created or updated after the last run
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"new_survey": Out(), "updated_survey": Out(), "survey_new_runcycleid": Out()})
def extract_survey(context, survey_last_run_cycle_time, survey_new_runcycleid):
    session = context.resources.met_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_survey = []
    updated_survey = []

    for last_run_cycle_time in survey_last_run_cycle_time:

        context.log.info("started extracting new data from survey table")
        new_survey = session.query(MetSurveyModel).filter(MetSurveyModel.created_date > last_run_cycle_time).all()

        if last_run_cycle_time > default_datetime:
            context.log.info("started extracting updated data from survey table")
            updated_survey = session.query(MetSurveyModel).filter(MetSurveyModel.updated_date > last_run_cycle_time,
                                                                  MetSurveyModel.updated_date != MetSurveyModel.created_date).all()

    yield Output(new_survey, "new_survey")

    yield Output(updated_survey, "updated_survey")

    yield Output(survey_new_runcycleid, "survey_new_runcycleid")

    context.log.info("completed extracting data from survey table")

    session.commit()

    session.close()


# load the surveys created or updated after last run to the analytics database
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"survey_new_runcycleid": Out()})
def load_survey(context, new_survey, updated_survey, survey_new_runcycleid):
    session = context.resources.met_etl_db_session
    all_surveys = new_survey + updated_survey

    if len(all_surveys) > 0:

        context.log.info("loading new survey")
        for survey in all_surveys:

            _do_etl_survey_data(session, survey, survey_new_runcycleid)

            _update_survey_responses_with_active_survey_id(session, survey)

            if survey.form_json is None:
                context.log.info('Survey Found without form_json: %s. Skipping it', survey.id)
                continue

            form_type = survey.form_json.get('display', None)

            page_position = 0  # Initialize the page-level position

            # check and load data for single page survey.
            if form_type == 'form':
                form_components = survey.form_json.get('components', None)
                page_position = extract_survey_components(context, session, survey, survey_new_runcycleid,
                                                          form_components, page_position)

            # check and load data for multi page survey.
            if form_type == 'wizard':
                pages = survey.form_json.get('components', None)
                for page in pages:
                    form_components = page.get('components', None)
                    page_position = extract_survey_components(context, session, survey, survey_new_runcycleid,
                                                              form_components, page_position)

    yield Output(survey_new_runcycleid, "survey_new_runcycleid")

    context.log.info("completed loading survey table")

    session.close()


# extract components within a survey
def extract_survey_components(context, session, survey, survey_new_runcycleid, form_components, position):
    if (form_components) is None:
        context.log.info('Survey Found without any component in form_json: %s. Skipping it', survey.id)
        return position

    _refresh_questions_and_available_option_status(session, survey.id)

    for component in form_components:
        position = position + 1
        component_type = component.get('type', None)
        context.log.info('Survey: %s.%s Processing component with id %s and type: %s and label %s ',
                         survey.id,
                         survey.name,
                         component.get('id', None),
                         component_type,
                         component.get('label', None))

        if not component_type:
            continue

        has_valid_question_type = _validate_form_type(context, component_type)

        if has_valid_question_type:
            etl_survey = session.query(EtlSurveyModel.id).filter(EtlSurveyModel.source_survey_id == survey.id,
                                                                 EtlSurveyModel.is_active == True)
            etl_survey_ids = [survey_id[0] for survey_id in etl_survey]
            for survey_id in etl_survey_ids:
                position = _do_etl_survey_inputs(session, survey_id, component, component_type,
                                                 survey_new_runcycleid, position)
                _load_available_response_option(session, survey_id, component, component_type,
                                                survey_new_runcycleid)

    return position


# inactivate if record is existing in analytics database
def _refresh_questions_and_available_option_status(session, source_survey_id):
    etl_survey_model = session.query(EtlSurveyModel.id).filter(EtlSurveyModel.source_survey_id == source_survey_id,
                                                               EtlSurveyModel.is_active == False)
    if not etl_survey_model:
        return

    deactive_flag = {'is_active': False}

    etl_survey_ids = [survey_id[0] for survey_id in etl_survey_model]
    for survey_id in etl_survey_ids:
        session.query(EtlRequestTypeOption).filter(EtlRequestTypeOption.survey_id == survey_id).update(deactive_flag)
        session.query(EtlAvailableResponseOption).filter(
            EtlAvailableResponseOption.survey_id == survey_id).update(deactive_flag)


def _do_etl_survey_data(session, survey, survey_new_runcycleid):
    session.query(EtlSurveyModel).filter(EtlSurveyModel.source_survey_id == survey.id).update({'is_active': False})

    survey_model = EtlSurveyModel(name=survey.name, source_survey_id=survey.id,
                                  engagement_id=survey.engagement_id, is_active=True,
                                  created_date=survey.created_date, updated_date=survey.updated_date,
                                  runcycle_id=survey_new_runcycleid, generate_dashboard=survey.generate_dashboard)

    session.add(survey_model)

    session.commit()


# load data to table request type tables
def _do_etl_survey_inputs(session, survey_id, component, component_type, survey_new_runcycleid, position):
    if component_type == FormIoComponentType.SURVEY.value:
        questions = component.get('questions', None)

        if not questions:
            return position

        for question in questions:
            position = position + 1
            model_name = EtlRequestTypeOption(survey_id=survey_id,
                                              request_id=component['id'] + '-' + question['value'],
                                              label=question['label'],
                                              is_active=True,
                                              key=component['key'] + '-' + question['value'],
                                              type=component['type'],
                                              runcycle_id=survey_new_runcycleid,
                                              position=position
                                              )

            session.add(model_name)

            session.commit()
    else:
        model_name = EtlRequestTypeOption(survey_id=survey_id,
                                          request_id=component['id'],
                                          label=component['label'],
                                          is_active=True,
                                          key=component['key'],
                                          type=component['type'],
                                          runcycle_id=survey_new_runcycleid,
                                          position=position
                                          )

        session.add(model_name)

        session.commit()

    return position


# load data to table available response option
def _load_available_response_option(session, survey_id, component, component_type, survey_new_runcycleid):
   
    if component_type == FormIoComponentType.SURVEY.value:
        _load_survey_available_response(session, component, survey_id, survey_new_runcycleid)
    elif component_type == FormIoComponentType.SELECTLIST.value:
        _load_selectlist_available_response(session, component, survey_id, survey_new_runcycleid)
    else:
        _load_default_available_response(session, component, survey_id, survey_new_runcycleid)


def _load_survey_available_response(session, component, survey_id, survey_new_runcycleid):
    values = component.get('values', None)
    if not values:
        return
    
    questions = component.get('questions', None)
    if not questions:
        return
    
    for question in questions:
        request_key = component['key'] + '-' + question['value']
        _do_etl_available_response_data(session, component, survey_id, values,
                                        request_key, survey_new_runcycleid)

def _load_selectlist_available_response(session, component, survey_id, survey_new_runcycleid):
    data = component.get('data', None)
    values = data.get('values', None)

    if not values:
        return
    
    request_key = component['key']
    _do_etl_available_response_data(session, component, survey_id, values,
                                    request_key, survey_new_runcycleid)

def _load_default_available_response(session, component, survey_id, survey_new_runcycleid):
    values = component.get('values', None)
    if not values:
        return
    
    request_key = component['key']
    _do_etl_available_response_data(session, component, survey_id, values,
                                    request_key, survey_new_runcycleid)


def _do_etl_available_response_data(session, component, survey_id, values, request_key, survey_new_runcycleid):
    for value in values:
        model_name = EtlAvailableResponseOption(survey_id=survey_id,
                                                request_key=request_key,
                                                value=value['label'],
                                                request_id=component['id'],
                                                is_active=True,
                                                runcycle_id=survey_new_runcycleid)

        session.add(model_name)

    session.commit()


def _validate_form_type(context, component_type):
    component_type = component_type.lower()

    if component_type in (FormIoComponentType.RADIO.value, FormIoComponentType.CHECKBOX.value,
                          FormIoComponentType.SELECTLIST.value, FormIoComponentType.SURVEY.value):
        return True
    else:
        context.log.info('*************Component Type Missed to match %s', component_type)
        return False


# update the status for survey etl in run cycle table as successful
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"flag_to_run_step_after_survey": Out()})
def survey_end_run_cycle(context, survey_new_runcycleid):
    met_etl_db_session = context.resources.met_etl_db_session

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == survey_new_runcycleid, EtlRunCycleModel.packagename == 'survey',
        EtlRunCycleModel.success == False).update(
        {'success': True, 'enddatetime': datetime.utcnow(),
         'description': 'ended the load for tables survey and requests'})

    context.log.info("run cycle ended for survey table")

    met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output("survey", "flag_to_run_step_after_survey")


def _update_survey_responses_with_active_survey_id(session, survey):
    etl_active_survey_id = session.query(EtlSurveyModel.id).filter(
        EtlSurveyModel.source_survey_id == survey.id, EtlSurveyModel.is_active == True).first()

    subquery = (
        session.query(EtlSurveyModel.id)
        .filter(EtlSurveyModel.source_survey_id == survey.id)
        .subquery()
    )

    # Fetch response records
    response_records = session.query(EtlResponseTypeOptionModel).filter(
        EtlResponseTypeOptionModel.survey_id.in_(subquery)).all()

    # Update each response record individually
    for record in response_records:
        session.query(EtlResponseTypeOptionModel).filter(EtlResponseTypeOptionModel.id == record.id).update(
            {'survey_id': etl_active_survey_id}, synchronize_session='fetch')

    session.commit()
