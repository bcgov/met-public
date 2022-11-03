from dagster import Out, Output, op
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from utils.config import get_met_db_creds, get_met_analytics_db_creds
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

@op(out={"survey_last_run_cycle_datetime": Out(), "surveynewruncycleid": Out()})
def get_survey_last_run_cycle_time(context):
    met_etl_db_session = _get_met_etl_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    survey_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'survey', EtlRunCycleModel.success == True).first()
    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()
    for lastruncycledatetime in survey_last_run_cycle_datetime:
        for runcycleid in max_run_cycle_id:
            new_run_cycle_id = runcycleid + 1
            met_etl_db_session.add(EtlRunCycleModel(id=new_run_cycle_id, packagename='survey', startdatetime=datetime.utcnow(), 
                        enddatetime=None, description='started the load for survey table', success=False))
            met_etl_db_session.commit()
            met_etl_db_session.close()
    yield Output(survey_last_run_cycle_datetime, "survey_last_run_cycle_datetime")
    yield Output(new_run_cycle_id, "surveynewruncycleid")

@op(out={"newsurvey": Out(), "updatedsurvey": Out(), "surveycurrentruncycleid": Out()})
def extract_survey(context, survey_last_run_cycle_datetime, surveynewruncycleid):
    session = _get_met_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_survey = []
    updated_survey = []
    for lastcycletime in survey_last_run_cycle_datetime:
        context.log.info("started extracting new data from survey table")
        new_survey = session.query(MetSurveyModel).filter(MetSurveyModel.created_date > lastcycletime).all()
        if lastcycletime > default_datetime:
            context.log.info("started extracting updated data from survey table")
            updated_survey = session.query(MetSurveyModel).filter(MetSurveyModel.updated_date > lastcycletime, MetSurveyModel.updated_date != MetSurveyModel.created_date).all()
    yield Output(new_survey, "newsurvey")
    yield Output(updated_survey, "updatedsurvey")
    yield Output(surveynewruncycleid, "surveycurrentruncycleid")
    context.log.info("completed extracting data from survey table")
    session.commit()
    session.close()

@op(out={"surveycurrentruncycleid": Out()})
def load_survey(context, newsurvey, updatedsurvey, surveynewruncycleid):
    session = _get_met_etl_session()
    allsurveys = newsurvey + updatedsurvey
    if len(allsurveys) > 0:
        context.log.info("loading new inputs")
        for survey in allsurveys:

            session.query(EtlSurveyModel).filter(EtlSurveyModel.source_survey_id == survey.id).update({'is_active': False})
            survey_model = EtlSurveyModel(name = survey.name, source_survey_id = survey.id, 
                                        engagement_id = survey.engagement_id, is_active=True, 
                                        created_date=survey.created_date, updated_date=survey.updated_date, 
                                        runcycle_id=surveynewruncycleid)
            session.add(survey_model)
            session.commit()

            if survey.form_json is None:
                context.log.info('Survey Found without form_json: %s.Skipping it', survey.id)
                continue

            form_components = survey.form_json.get('components', None)
            if (form_components) is None:
                context.log.info('Survey Found without any component in form_json: %s.Skipping it', survey.id)
                continue

            session.query(MetRequestTypeOption).filter(MetRequestTypeOption.survey_id == survey.id).update({'is_active': False})
            session.query(MetRequestTypeRadioModel).filter(MetRequestTypeRadioModel.survey_id == survey.id).update({'is_active': False})
            session.query(MetRequestTypeSelectBoxesModel).filter(MetRequestTypeSelectBoxesModel.survey_id == survey.id).update({'is_active': False})
            session.query(MetRequestTypeTextModel).filter(MetRequestTypeTextModel.survey_id == survey.id).update({'is_active': False})
            session.query(MetRequestTypeTextAreaModel).filter(MetRequestTypeTextAreaModel.survey_id == survey.id).update({'is_active': False})

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

                model_type = None

                component_type = component_type.lower()
                if component_type == FormIoComponentType.RADIO.value:
                    # radio save only the question label
                    model_type = MetRequestTypeRadioModel
                elif component_type == FormIoComponentType.CHECKBOX.value:
                    # select box save only the question label
                    model_type = MetRequestTypeSelectBoxesModel
                elif component_type == FormIoComponentType.TEXT.value:
                    # select box save only the question label
                     model_type = MetRequestTypeTextAreaModel
                else:
                    context.log.info('*************Component Type Missed to match %s', component_type)

                if model_type:
                    model_name = model_type(survey_id=survey.id,
                                        request_id=component['id'],
                                        label=component['label'],
                                        is_active=True,
                                        key=component['key'],
                                        type=component['type'],
                                        runcycle_id=surveynewruncycleid
                                        )
                    session.add(model_name)
                    session.commit()

                    if model_type == MetRequestTypeRadioModel or model_type == MetRequestTypeSelectBoxesModel:
                        model_name = MetRequestTypeOption(survey_id=survey.id,
                                        request_id=component['id'],
                                        label=component['label'],
                                        is_active=True,
                                        key=component['key'],
                                        type=component['type'],
                                        runcycle_id=surveynewruncycleid
                                        )
                        session.add(model_name)
                        session.commit()

    yield Output(surveynewruncycleid, "surveycurrentruncycleid")
    context.log.info("completed loading survey table")
    session.close()

@op
def survey_end_run_cycle(context, surveynewruncycleid):
    met_etl_db_session = _get_met_etl_session()
    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == surveynewruncycleid, EtlRunCycleModel.packagename == 'survey', 
        EtlRunCycleModel.success == False).update({'success': True, 'description': 'ended the load for survey table'})
    context.log.info("run cycle ended for survey table")
    met_etl_db_session.commit()
    met_etl_db_session.close()