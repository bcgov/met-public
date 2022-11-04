from dagster import job
from ops.user_etl_service import get_user_details_last_run_cycle_time, extract_user, load_user, user_details_end_run_cycle
from ops.survey_etl_service import get_survey_last_run_cycle_time, extract_survey, load_survey, survey_end_run_cycle
from ops.submission_etl_service import get_submission_last_run_cycle_time, extract_submission, load_submission, load_user_response_details, submission_end_run_cycle
from ops.comments_etl_service import get_comments_last_run_cycle_time, extract_comments, load_comments, comments_end_run_cycle
from ops.engagement_etl_service import extract_engagement, load_engagement

@job
def met_data_ingestion():
    # etl run for survey
    survey_last_run_cycle_time, survey_new_runcycleid_created = get_survey_last_run_cycle_time()
    
    new_survey, updated_survey, survey_new_runcycleid_passed_to_load = extract_survey(survey_last_run_cycle_time, 
                                                                            survey_new_runcycleid_created)

    survey_new_runcycleid_passed_to_end = load_survey(new_survey, updated_survey, 
                                                                            survey_new_runcycleid_passed_to_load)

    flag_to_run_step_after_survey = survey_end_run_cycle(survey_new_runcycleid_passed_to_end)

    # etl run for submissions
    submission_last_run_cycle_time, submission_new_runcycleid_created = get_submission_last_run_cycle_time(
                                                                            flag_to_run_step_after_survey)

    new_submission, updated_submission, submission_new_runcycleid_passed_to_load = extract_submission(
                                                                            submission_last_run_cycle_time, 
                                                                            submission_new_runcycleid_created)

    submission_new_runcycleid_passed_to_load_reponse = load_submission(new_submission, updated_submission, 
                                                                            submission_new_runcycleid_passed_to_load)

    submission_new_runcycleid_passed_to_end = load_user_response_details(new_submission, updated_submission, 
                                                                            submission_new_runcycleid_passed_to_load_reponse)
                                                                        
    flag_to_run_step_after_submission = submission_end_run_cycle(submission_new_runcycleid_passed_to_end)
	
    # etl run for comments
    comments_last_run_cycle_time, comments_new_runcycleid_created = get_comments_last_run_cycle_time(
                                                                            flag_to_run_step_after_submission)

    new_comments, comments_new_runcycleid_passed_to_load = extract_comments(comments_last_run_cycle_time, 
                                                                            comments_new_runcycleid_created)

    comments_new_runcycleid_passed_to_end = load_comments(new_comments, comments_new_runcycleid_passed_to_load)
    
    flag_to_run_step_after_comments = comments_end_run_cycle(comments_new_runcycleid_passed_to_end)