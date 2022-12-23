import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { PublicSubmission, SurveySubmission } from 'models/surveySubmission';
import { Comment } from 'models/comment';
import { Page } from 'services/type';

interface ReviewCommentRequest {
    submission_id: number;
    status_id: number;
    has_personal_info?: boolean;
    has_profanity?: boolean;
    has_threat?: boolean;
    rejected_reason_other?: string;
}
export const reviewComments = async (requestData: ReviewCommentRequest): Promise<SurveySubmission> => {
    const url = replaceUrl(Endpoints.SurveySubmission.REVIEW, 'submission_id', String(requestData.submission_id));
    const response = await http.PutRequest<SurveySubmission>(url, requestData);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update comments');
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
    const response = await http.GetRequest<Page<SurveySubmission>>(url, {
        page,
        size,
        sort_key,
        sort_order,
        search_text,
    });
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch submission page');
};

export const getSubmission = async (submissionId: number): Promise<SurveySubmission> => {
    const url = replaceUrl(Endpoints.SurveySubmission.GET, 'submission_id', String(submissionId));
    try {
        const response = await http.GetRequest<SurveySubmission>(url);
        if (response.data) {
            return Promise.resolve(response.data);
        }
        return Promise.reject('Failed to fetch submission');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getSubmissionByToken = async (token: string): Promise<PublicSubmission> => {
    const url = replaceUrl(Endpoints.PublicSubmission.UPDATE, 'verification_token', token || '');
    try {
        const response = await http.GetRequest<PublicSubmission>(url);
        if (response.data) {
            return Promise.resolve(response.data);
        }
        return Promise.reject('Failed to fetch submission');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostSurveySubmissionRequest {
    survey_id: number;
    submission_json: unknown;
    verification_token: string;
}
export const submitSurvey = async (requestData: PostSurveySubmissionRequest): Promise<void> => {
    try {
        const url = replaceUrl(Endpoints.PublicSubmission.UPDATE, 'verification_token', requestData.verification_token);
        await http.PostRequest(url, requestData);
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
};

interface UpdateSubmissionRequest {
    comments: Comment[];
}
export const updateSubmission = async (token: string, requestData: UpdateSubmissionRequest): Promise<void> => {
    const url = replaceUrl(Endpoints.PublicSubmission.UPDATE, 'verification_token', token || '');
    try {
        await http.PutRequest(url, requestData);
        return Promise.resolve();
    } catch (err) {
        return Promise.reject('Failed to update submission');
    }
};
