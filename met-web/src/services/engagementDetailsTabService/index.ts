import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';
import { EngagementDetailsTab } from 'models/engagementDetailsTab';

export const getDetailsTabs = async (engagementId: number): Promise<EngagementDetailsTab[]> => {
    const url = replaceUrl(Endpoints.EngagementDetailsTab.GET_LIST, 'engagement_id', String(engagementId));
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<EngagementDetailsTab[]>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch engagement details tabs');
};

export const postDetailsTabs = async (
    engagement_id: number,
    tabs: EngagementDetailsTab[],
): Promise<EngagementDetailsTab[]> => {
    try {
        const url = replaceUrl(Endpoints.EngagementDetailsTab.CREATE, 'engagement_id', String(engagement_id));
        const response = await http.PostRequest<EngagementDetailsTab[]>(url, tabs);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create engagement details tabs');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const patchDetailsTabs = async (
    engagementId: number,
    tabs: EngagementDetailsTab[],
): Promise<EngagementDetailsTab[]> => {
    const url = replaceAllInURL({
        URL: Endpoints.EngagementDetailsTab.UPDATE,
        params: {
            engagement_id: String(engagementId),
        },
    });
    const response = await http.PutRequest<EngagementDetailsTab[]>(url, tabs);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement details tabs');
};
