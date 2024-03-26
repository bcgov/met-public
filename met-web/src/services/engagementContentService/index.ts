import http from 'apiManager/httpRequestHandler';
import { EngagementContent } from 'models/engagementContent';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';

export const getEngagementContent = async (engagementId: number): Promise<EngagementContent[]> => {
    const url = replaceUrl(Endpoints.EngagementContent.GET, 'engagement_id', String(engagementId));
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<EngagementContent[]>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch engagement content');
};

interface PostEngagementContent {
    title?: string;
    icon_name?: string;
    content_type?: string;
    sort_index?: number;
    is_internal?: boolean;
    engagement_id?: number;
}
export const postEngagementContent = async (
    engagement_id: number,
    data: PostEngagementContent,
): Promise<EngagementContent> => {
    try {
        const url = replaceUrl(Endpoints.EngagementContent.CREATE, 'engagement_id', String(engagement_id));
        const response = await http.PostRequest<EngagementContent>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create engagement content');
    } catch (err) {
        return Promise.reject(err);
    }
};

export interface PatchEngagementContentRequest {
    title?: string;
    icon_name?: string;
}
export const patchEngagementContent = async (
    engagementId: number,
    contentId: number,
    data: PatchEngagementContentRequest,
): Promise<EngagementContent> => {
    const url = replaceAllInURL({
        URL: Endpoints.EngagementContent.UPDATE,
        params: {
            engagement_id: String(engagementId),
            content_id: String(contentId),
        },
    });
    const response = await http.PatchRequest<EngagementContent>(url, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement content');
};

export const deleteEngagementContent = async (engagementId: number, contentId: number): Promise<EngagementContent> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.EngagementContent.DELETE,
            params: {
                engagement_id: String(engagementId),
                content_id: String(contentId),
            },
        });
        const response = await http.DeleteRequest<EngagementContent>(url);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to delete engagement content');
    } catch (err) {
        return Promise.reject(err);
    }
};
