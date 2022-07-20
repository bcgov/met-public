import http from 'apiManager/httpRequestHandler';
import { Survey } from 'models/survey';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

interface FetchSurveyParams {
    unlinked?: boolean;
}
export const fetchSurveys = async (params: FetchSurveyParams = {}): Promise<Survey[]> => {
    const responseData = await http.GetRequest<Survey[]>(Endpoints.Survey.GET_ALL, params);
    return responseData.data.result ?? [];
};

export const getSurvey = async (surveyId: number): Promise<Survey> => {
    const url = replaceUrl(Endpoints.Survey.GET, '<survey_id>', String(surveyId));
    if (!surveyId || isNaN(Number(surveyId))) {
        return Promise.reject('Invalid Survey Id ' + surveyId);
    }
    try {
        const response = await http.GetRequest<Survey>(url);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch survey');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostSurveyRequest {
    name: string;
    components?: unknown[];
    engagement_id?: string;
}
export const postSurvey = async (data: PostSurveyRequest): Promise<Survey> => {
    try {
        const response = await http.PostRequest<Survey>(Endpoints.Survey.CREATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create survey');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PutSurveyRequest {
    id: string;
    form_json: unknown;
    engagement_id?: string;
}
export const putSurvey = async (data: PutSurveyRequest): Promise<Survey> => {
    try {
        const response = await http.PutRequest<Survey>(Endpoints.Survey.UPDATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update survey');
    } catch (err) {
        return Promise.reject(err);
    }
};
