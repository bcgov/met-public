from dagster import Out, Output, op
from sqlalchemy import func
from datetime import datetime

from met_cron.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from met_cron.models.request_type_option import RequestTypeOption as MetRequestTypeOption
from met_cron.models.request_type_radio import RequestTypeRadio as MetRequestTypeRadioModel
from met_cron.models.request_type_selectbox import RequestTypeSelectbox as MetRequestTypeSelectBoxesModel
from met_cron.models.request_type_textarea import RequestTypeTextarea as MetRequestTypeTextAreaModel
from met_cron.models.request_type_textfield import RequestTypeTextfield as MetRequestTypeTextModel
from met_cron.models.survey import Survey as EtlSurveyModel
from met_api.models.survey import Survey as MetSurveyModel
from met_cron.utils import FormIoComponentType


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
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"new_survey": Out(), "updated_survey": Out(), "survey_new_runcycleid": Out()})
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
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},out={"survey_new_runcycleid": Out()})
def load_survey(context, new_survey, updated_survey, survey_new_runcycleid):
    session = context.resources.met_etl_db_session
    all_surveys = new_survey + updated_survey

    if len(all_surveys) > 0:

        context.log.info("loading new inputs")
        for survey in all_surveys:

            _do_etl_survey_data(session, survey, survey_new_runcycleid)

            if survey.form_json is None:
                context.log.info('Survey Found without form_json: %s.Skipping it', survey.id)
                continue

            form_components = survey.form_json.get('components', None)
            if (form_components) is None:
                context.log.info('Survey Found without any component in form_json: %s.Skipping it', survey.id)
                continue

            _inactivate_old_questions(session, survey.id)

            position = 0

            for component in form_components:
                position = position + 1
                component_type = component.get('inputType', None)
                context.log.info('Survey: %s.%sProcessing component with id %s and type: %s and label %s ',
                                 survey.id,
                                 survey.name,
                                 component.get('id', None),
                                 component_type,
                                 component.get('label', None))

                if not component_type:
                    continue

                model_type = _identify_form_type(context, component_type)

                if model_type:
                    etl_survey = session.query(EtlSurveyModel.id).filter(EtlSurveyModel.source_survey_id == survey.id,
                                                                         EtlSurveyModel.is_active == True)
                    for survey_id in etl_survey:
                        _do_etl_survey_inputs(model_type, session, survey_id, component, survey_new_runcycleid,
                                              position)

    yield Output(survey_new_runcycleid, "survey_new_runcycleid")

    context.log.info("completed loading survey table")

    session.close()


# inactivate if record is existing in analytics database
def _inactivate_old_questions(session, source_survey_id):
    etl_survey_model = session.query(EtlSurveyModel.id).filter(EtlSurveyModel.source_survey_id == source_survey_id,
                                                               EtlSurveyModel.is_active == False)
    if not etl_survey_model:
        return

    deactive_flag = {'is_active': False}

    for survey_id in etl_survey_model:
        session.query(MetRequestTypeOption).filter(MetRequestTypeOption.survey_id == survey_id).update(deactive_flag)
        session.query(MetRequestTypeRadioModel).filter(MetRequestTypeRadioModel.survey_id == survey_id).update(
            deactive_flag)
        session.query(MetRequestTypeSelectBoxesModel).filter(
            MetRequestTypeSelectBoxesModel.survey_id == survey_id).update(deactive_flag)
        session.query(MetRequestTypeTextModel).filter(MetRequestTypeTextModel.survey_id == survey_id).update(
            deactive_flag)
        session.query(MetRequestTypeTextAreaModel).filter(MetRequestTypeTextAreaModel.survey_id == survey_id).update(
            deactive_flag)


def _do_etl_survey_data(session, survey, survey_new_runcycleid):
    session.query(EtlSurveyModel).filter(EtlSurveyModel.source_survey_id == survey.id).update({'is_active': False})

    survey_model = EtlSurveyModel(name=survey.name, source_survey_id=survey.id,
                                  engagement_id=survey.engagement_id, is_active=True,
                                  created_date=survey.created_date, updated_date=survey.updated_date,
                                  runcycle_id=survey_new_runcycleid)

    session.add(survey_model)

    session.commit()


# load data to table request type tables
def _do_etl_survey_inputs(model_type, session, survey_id, component, survey_new_runcycleid, position):
    model_name = model_type(survey_id=survey_id,
                            request_id=component['id'],
                            label=component['label'],
                            is_active=True,
                            key=component['key'],
                            type=component['type'],
                            runcycle_id=survey_new_runcycleid,
                            postion=position
                            )

    session.add(model_name)

    session.commit()

    if model_type == MetRequestTypeRadioModel or model_type == MetRequestTypeSelectBoxesModel:
        model_name = MetRequestTypeOption(survey_id=survey_id,
                                          request_id=component['id'],
                                          label=component['label'],
                                          is_active=True,
                                          key=component['key'],
                                          type=component['type'],
                                          runcycle_id=survey_new_runcycleid,
                                          postion=position
                                          )

        session.add(model_name)

        session.commit()


def _identify_form_type(context, component_type):
    model_type = None
    component_type = component_type.lower()

    if component_type == FormIoComponentType.RADIO.value:
        # radio save only the question label
        model_type = MetRequestTypeRadioModel
    elif component_type == FormIoComponentType.CHECKBOX.value:
        # select box save only the question label
        model_type = MetRequestTypeSelectBoxesModel
    elif component_type == FormIoComponentType.TEXT.value:
        model_type = MetRequestTypeTextAreaModel
        # select box save only the question label
    else:
        context.log.info('*************Component Type Missed to match %s', component_type)
    return model_type


# update the status for survey etl in run cycle table as successful
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"flag_to_run_step_after_survey": Out()})
def survey_end_run_cycle(context, survey_new_runcycleid):
    met_etl_db_session = context.resources.met_etl_db_session

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == survey_new_runcycleid, EtlRunCycleModel.packagename == 'survey',
        EtlRunCycleModel.success == False).update(
        {'success': True, 'enddatetime': datetime.utcnow(), 'description': 'ended the load for tables survey and requests'})

    context.log.info("run cycle ended for survey table")

    met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output("survey", "flag_to_run_step_after_survey")
