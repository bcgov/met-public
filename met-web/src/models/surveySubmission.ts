import { Comment } from './comment';
import { Survey } from './survey';

export interface SurveySubmission {
    id: number;
    submission_json: unknown;
    responseCount: number;
    created_date: string;
    created_by: string;
    survey_id: number;
    survey: Survey;
    comments: Comment[];
}
