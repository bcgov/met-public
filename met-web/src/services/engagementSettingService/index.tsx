import http from 'apiManager/httpRequestHandler';
import { EngagementSettings } from 'models/engagement';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const getEngagementSettings = async (engagementId: number): Promise<EngagementSettings> => {
    const url = replaceUrl(Endpoints.EngagementSettings.GET, 'engagement_id', String(engagementId));
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<EngagementSettings>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch engagement');
};

export const postEngagementSettings = async (data: EngagementSettings): Promise<EngagementSettings> => {
    const response = await http.PostRequest<EngagementSettings>(Endpoints.EngagementSettings.CREATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to create engagement metadata');
};

export const patchEngagementSettings = async (data: EngagementSettings): Promise<EngagementSettings> => {
    const response = await http.PatchRequest<EngagementSettings>(Endpoints.EngagementSettings.UPDATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement metadata');
};
