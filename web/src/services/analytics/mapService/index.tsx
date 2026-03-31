import http from 'apiManager/httpRequestHandler';
import { Map } from 'models/analytics/map';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const getMapData = async (engagementId: number): Promise<Map> => {
    const url = replaceUrl(Endpoints.AnalyticsMap.GET, 'engagement_id', String(engagementId));
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<Map>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch map data');
};
