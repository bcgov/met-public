import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { SurveySubmission } from 'models/surveySubmission';

interface PostSurveySubmissionRequest {
    survey_id: number;
    submission_json: unknown;
}
export const submitSurvey = async (data: PostSurveySubmissionRequest): Promise<SurveySubmission> => {
    try {
        const response = await http.PostRequest<SurveySubmission>(Endpoints.SurveySubmission.CREATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to submit survey');
    } catch (err) {
        return Promise.reject(err);
    }
};
