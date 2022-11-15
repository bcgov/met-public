import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { SurveySubmission } from 'models/surveySubmission';
import { Page } from 'services/type';

interface ReviewCommentRequest {
    status_id: number;
    submission_id: number;
}
export const reviewComments = async ({ submission_id, status_id }: ReviewCommentRequest): Promise<SurveySubmission> => {
    try {
        const url = replaceUrl(Endpoints.SurveySubmission.REVIEW, 'submission_id', String(submission_id));
        const response = await http.PutRequest<SurveySubmission>(url, { status_id });
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update comments');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface GetSubmissionsParams {
    survey_id: number;
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
}
export const getSubmissionPage = async ({
    survey_id,
    page,
    size,
    sort_key,
    sort_order,
    search_text,
}: GetSubmissionsParams): Promise<Page<SurveySubmission>> => {
    const url = replaceUrl(Endpoints.SurveySubmission.GET_LIST, 'survey_id', String(survey_id));
    const responseData = await http.GetRequest<Page<SurveySubmission>>(url, {
        page,
        size,
        sort_key,
        sort_order,
        search_text,
    });
    return (
        responseData.data.result ?? {
            items: [],
            total: 0,
        }
    );
};

export const getSubmission = async (submissionId: number): Promise<SurveySubmission> => {
    const url = replaceUrl(Endpoints.SurveySubmission.GET, 'submission_id', String(submissionId));
    try {
        const response = await http.GetRequest<SurveySubmission>(url);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch comments');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostSurveySubmissionRequest {
    survey_id: number;
    submission_json: unknown;
    verification_token: string;
}
export const submitSurvey = async (requestData: PostSurveySubmissionRequest): Promise<SurveySubmission> => {
    try {
        const response = await http.PostRequest<SurveySubmission>(Endpoints.SurveySubmission.CREATE, requestData);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to submit survey');
    } catch (err) {
        return Promise.reject(err);
    }
};
