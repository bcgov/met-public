import { Comment } from './comment';

export interface SurveySubmission {
    id: number;
    survey_id: number;
    submission_json: unknown;
    created_date: string;
    reviewed_by: string;
    review_date: string;
    comment_status_id: number;

    comments?: Comment[];
}

export const createDefaultSubmission = (): SurveySubmission => {
    return {
        id: 0,
        submission_json: {},
        survey_id: 0,
        created_date: '',
        review_date: '',
        reviewed_by: '',
        comment_status_id: 1,
    };
};
