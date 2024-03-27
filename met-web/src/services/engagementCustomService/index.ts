import http from 'apiManager/httpRequestHandler';
import { EngagementCustomContent } from 'models/engagementCustomContent';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';

export const getCustomContent = async (contentId: number): Promise<EngagementCustomContent[]> => {
    const url = replaceUrl(Endpoints.EngagementCustomContent.GET, 'content_id', String(contentId));
    if (!contentId || isNaN(Number(contentId))) {
        return Promise.reject('Invalid content Id ' + contentId);
    }
    const response = await http.GetRequest<EngagementCustomContent[]>(url); // Notice the change here
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch engagement Custom content');
};

interface PostCustomContentRequest {
    custom_text_content?: string;
    custom_json_content?: string;
    engagement_id?: number;
    engagement_content_id?: number;
}
export const postCustomContent = async (
    contentId: number,
    data: PostCustomContentRequest,
): Promise<EngagementCustomContent> => {
    try {
        const url = replaceUrl(Endpoints.EngagementCustomContent.CREATE, 'content_id', String(contentId));
        const response = await http.PostRequest<EngagementCustomContent>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create engagement Custom content');
    } catch (err) {
        return Promise.reject(err);
    }
};

export interface PatchCustomContentRequest {
    custom_text_content?: string;
    custom_json_content?: string;
}
export const patchCustomContent = async (
    contentId: number,
    data: PatchCustomContentRequest,
): Promise<EngagementCustomContent> => {
    const url = replaceAllInURL({
        URL: Endpoints.EngagementCustomContent.UPDATE,
        params: {
            content_id: String(contentId),
        },
    });
    const response = await http.PatchRequest<EngagementCustomContent>(url, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement Custom content');
};
