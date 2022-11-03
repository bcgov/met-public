from dagster import job
from ops.user_etl_service import get_user_details_last_run_cycle_time, user_details_end_run_cycle, extract_user, load_user
from ops.survey_etl_service import get_survey_last_run_cycle_time, survey_end_run_cycle, extract_survey, load_survey
from ops.submission_etl_service import get_submission_last_run_cycle_time, extract_submission, load_submission, load_user_response_details, submission_end_run_cycle
from ops.engagement_etl_service import extract_engagement, load_engagement

@job
def met_data_ingestion():
    submissionlastruncycledatetime, submissionnewruncycleid = get_submission_last_run_cycle_time()
    newsubmission, updatedsubmission, submissioncurrentruncycleid = extract_submission(submissionlastruncycledatetime, submissionnewruncycleid)
    submissioncurrentruncycleid = load_submission(newsubmission, updatedsubmission, submissioncurrentruncycleid)
    submissioncurrentruncycleid = load_user_response_details(newsubmission, updatedsubmission, submissioncurrentruncycleid)
    submission_end_run_cycle(submissioncurrentruncycleid)