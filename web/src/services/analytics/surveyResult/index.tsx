import http from 'apiManager/httpRequestHandler';
import { SurveyResultData } from 'models/analytics/surveyResult';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const getSurveyResultData = async (engagementId: number, dashboardType: string): Promise<SurveyResultData> => {
    const url = replaceUrl(
        replaceUrl(Endpoints.AnalyticsSurveyResult.GET, 'engagement_id', String(engagementId)),
        'dashboard_type',
        dashboardType,
    );
    const response = await http.GetRequest<SurveyResultData>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch survey result data');
};
