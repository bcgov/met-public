import http from 'apiManager/httpRequestHandler';
import { EngagementSummaryContent } from 'models/engagementSummaryContent';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';

export const getSummaryContent = async (contentId: number): Promise<EngagementSummaryContent[]> => {
    const url = replaceUrl(Endpoints.EngagementSummaryContent.GET, 'content_id', String(contentId));
    if (!contentId || isNaN(Number(contentId))) {
        return Promise.reject('Invalid content Id ' + contentId);
    }
    const response = await http.GetRequest<EngagementSummaryContent[]>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch engagement summary content');
};

interface PostSummaryContentRequest {
    content?: string;
    rich_content?: string;
    engagement_id?: number;
}
export const postSummaryContent = async (
    contentId: number,
    data: PostSummaryContentRequest,
): Promise<EngagementSummaryContent> => {
    try {
        const url = replaceUrl(Endpoints.EngagementSummaryContent.CREATE, 'content_id', String(contentId));
        const response = await http.PostRequest<EngagementSummaryContent>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create engagement summary content');
    } catch (err) {
        return Promise.reject(err);
    }
};

export interface PatchSummaryContentRequest {
    content?: string;
    rich_content?: string;
}
export const patchSummaryContent = async (
    contentId: number,
    data: PatchSummaryContentRequest,
): Promise<EngagementSummaryContent> => {
    const url = replaceAllInURL({
        URL: Endpoints.EngagementSummaryContent.UPDATE,
        params: {
            content_id: String(contentId),
        },
    });
    const response = await http.PatchRequest<EngagementSummaryContent>(url, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement summary content');
};
