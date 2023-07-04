from dagster import Out, Output, op
from sqlalchemy import func
from datetime import datetime

from analytics_api.models.etlruncycle import EtlRunCycle as EtlRunCycleModel
from analytics_api.models.request_type_option import RequestTypeOption as EtlRequestTypeOptionModel
from analytics_api.models.survey import Survey as EtlSurveyModel
from met_api.models.report_setting import ReportSetting as MetReportSettingModel


# get the last run cycle id for report setting etl
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"setting_last_run_cycle_datetime": Out(), "setting_new_run_cycle_id": Out()})
def get_setting_last_run_cycle_time(context, flag_to_run_step_after_survey):
    met_etl_db_session = context.resources.met_etl_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)

    setting_last_run_cycle_datetime = met_etl_db_session.query(
        func.coalesce(func.max(EtlRunCycleModel.enddatetime), default_datetime)).filter(
        EtlRunCycleModel.packagename == 'report_setting', EtlRunCycleModel.success == True).first()

    max_run_cycle_id = met_etl_db_session.query(func.coalesce(func.max(EtlRunCycleModel.id), 0)).first()

    for last_run_cycle_time in setting_last_run_cycle_datetime:

        for run_cycle_id in max_run_cycle_id:
            new_run_cycle_id = run_cycle_id + 1
            met_etl_db_session.add(
                EtlRunCycleModel(id=new_run_cycle_id, packagename='report_setting',
                                 startdatetime=datetime.utcnow(),
                                 enddatetime=None, description='started the load for table report_setting',
                                 success=False))
            met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output(setting_last_run_cycle_datetime, "setting_last_run_cycle_datetime")

    yield Output(new_run_cycle_id, "setting_new_run_cycle_id")


# extract the report settings that have been created or updated after the last run
@op(required_resource_keys={"met_db_session", "met_etl_db_session"},
    out={"new_setting": Out(), "updated_setting": Out(), "setting_new_runcycleid": Out()})
def extract_setting(context, setting_last_run_cycle_time, setting_new_runcycleid):
    session = context.resources.met_db_session
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_setting = []
    updated_setting = []

    for last_run_cycle_time in setting_last_run_cycle_time:
        context.log.info("started extracting new data from report setting table")
        new_setting = session.query(MetReportSettingModel).filter(
            MetReportSettingModel.created_date > last_run_cycle_time).all()

        if last_run_cycle_time > default_datetime:
            context.log.info("started extracting updated data from report setting table")
            updated_setting = session.query(MetReportSettingModel).filter(
				MetReportSettingModel.updated_date > last_run_cycle_time,
                MetReportSettingModel.updated_date != MetReportSettingModel.created_date).all()

    yield Output(new_setting, "new_setting")
	
    yield Output(updated_setting, "updated_setting")

    yield Output(setting_new_runcycleid, "setting_new_runcycleid")

    context.log.info("completed extracting data from report setting table")

    session.commit()

    session.close()


# load the report setting created or updated after last run to the analytics database
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"setting_new_runcycleid": Out()})
def load_setting(context, new_setting, updated_setting, setting_new_runcycleid):
    met_etl_db_session = context.resources.met_etl_db_session
    all_settings = new_setting + updated_setting
    if len(all_settings) > 0:

        context.log.info("loading new inputs")
        for setting in all_settings:
            # get the survey id from analytics database based on the source system survey id
            analytics_survey_data= met_etl_db_session.query(EtlSurveyModel)\
            .filter(EtlSurveyModel.source_survey_id == setting.survey_id,
                    EtlSurveyModel.is_active == True).first()
            
            # update the display flag for the report setting question key and survey id fetched above
            met_etl_db_session.query(EtlRequestTypeOptionModel)\
            .filter(EtlRequestTypeOptionModel.key == setting.question_key,
                    EtlRequestTypeOptionModel.survey_id == analytics_survey_data.id,
                    EtlRequestTypeOptionModel.is_active == True).update({'display': setting.display})
            met_etl_db_session.commit()

    yield Output(setting_new_runcycleid, "setting_new_runcycleid")

    context.log.info("completed loading report setting table")

    met_etl_db_session.close()


# update the status for report setting etl in run cycle table as successful
@op(required_resource_keys={"met_db_session", "met_etl_db_session"}, out={"flag_to_run_step_after_setting": Out()})
def setting_end_run_cycle(context, setting_new_runcycleid):
    met_etl_db_session = context.resources.met_etl_db_session

    met_etl_db_session.query(EtlRunCycleModel).filter(
        EtlRunCycleModel.id == setting_new_runcycleid, EtlRunCycleModel.packagename == 'report_setting',
        EtlRunCycleModel.success == False).update(
        {'success': True, 'enddatetime': datetime.utcnow(), 'description': 'ended the load for table report_setting'})

    context.log.info("run cycle ended for report setting table")

    met_etl_db_session.commit()

    met_etl_db_session.close()

    yield Output("report_setting", "flag_to_run_step_after_setting")
