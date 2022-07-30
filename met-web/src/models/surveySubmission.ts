import { Survey } from './survey';

export interface SurveySubmission {
    id: number;
    submission_json: unknown;
    responseCount: number;
    created_date: string;
    created_by: string;
    survey: Survey;
}
