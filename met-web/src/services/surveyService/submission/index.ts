import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { SurveySubmission } from 'models/surveySubmission';

interface PostSurveySubmissionRequest {
    survey_id: number;
    submission_json: unknown;
    verification_token: string;
}
export const submitSurvey = async (requestData: PostSurveySubmissionRequest): Promise<SurveySubmission> => {
    try {
        const response = await http.PostRequest<SurveySubmission>(Endpoints.Submission.CREATE, requestData);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to submit survey');
    } catch (err) {
        return Promise.reject(err);
    }
};
