import http from 'apiManager/httpRequestHandler';
import { SurveyResultData } from 'models/analytics/surveyResult';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const getSurveyResultData = async (engagementId: number): Promise<SurveyResultData> => {
    const url = replaceUrl(Endpoints.AnalyticsSurveyResult.GET, 'engagement_id', String(engagementId));
    const response = await http.GetRequest<SurveyResultData>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch survey result data');
};
