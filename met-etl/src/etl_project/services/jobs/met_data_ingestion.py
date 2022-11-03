from dagster import job
from ops.user_etl_service import get_user_details_last_run_cycle_time, user_details_end_run_cycle, extract_user, load_user
from ops.survey_etl_service import get_survey_last_run_cycle_time, extract_survey, load_survey, survey_end_run_cycle
from ops.submission_etl_service import get_submission_last_run_cycle_time, extract_submission, load_submission, load_user_response_details, submission_end_run_cycle
from ops.engagement_etl_service import extract_engagement, load_engagement

@job
def met_data_ingestion():
    survey_last_run_cycle_time, survey_new_runcycleid_step1 = get_survey_last_run_cycle_time()
    new_survey, updated_survey, survey_new_runcycleid_step2 = extract_survey(survey_last_run_cycle_time, survey_new_runcycleid_step1)
    survey_new_runcycleid_step3 = load_survey(new_survey, updated_survey, survey_new_runcycleid_step2)
    flag_to_run_step_after_survey = survey_end_run_cycle(survey_new_runcycleid_step3)
    submission_last_run_cycle_time, submission_new_runcycleid_step1 = get_submission_last_run_cycle_time(flag_to_run_step_after_survey)
    new_submission, updated_submission, submission_new_runcycleid_step2 = extract_submission(submission_last_run_cycle_time, submission_new_runcycleid_step1)
    submission_new_runcycleid_step3 = load_submission(new_submission, updated_submission, submission_new_runcycleid_step2)
    submission_new_runcycleid_step4 = load_user_response_details(new_submission, updated_submission, submission_new_runcycleid_step3)
    flag_to_run_step_after_submission = submission_end_run_cycle(submission_new_runcycleid_step4)