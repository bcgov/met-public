import http from 'apiManager/httpRequestHandler';
import { EngagementMetadata } from 'models/engagement';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const getEngagementMetadata = async (engagementId: number): Promise<EngagementMetadata> => {
    const url = replaceUrl(Endpoints.EngagementMetadata.GET_BY_ENG, 'engagement_id', String(engagementId));
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<EngagementMetadata>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch engagement');
};

export const postEngagementMetadata = async (data: EngagementMetadata): Promise<EngagementMetadata> => {
    const response = await http.PostRequest<EngagementMetadata>(Endpoints.EngagementMetadata.CREATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to create engagement metadata');
};

export const patchEngagementMetadata = async (data: EngagementMetadata): Promise<EngagementMetadata> => {
    const response = await http.PatchRequest<EngagementMetadata>(Endpoints.EngagementMetadata.UPDATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement metadata');
};
