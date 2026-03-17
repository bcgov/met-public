import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';
import { SuggestedEngagement, SuggestedEngagementWithAttachment } from 'models/suggestedEngagement';
import axios from 'axios';
import { ApiErrorBody } from 'services/engagementService';

export const getSuggestedEngagements = async (
    engagementId: number,
    attach = false,
): Promise<SuggestedEngagement[] | SuggestedEngagementWithAttachment[]> => {
    const url = replaceUrl(Endpoints.SuggestedEngagement.GET_LIST, 'engagement_id', String(engagementId));
    if (!engagementId || Number.isNaN(Number(engagementId))) {
        throw new Error('Invalid Engagement Id ' + engagementId);
    }
    try {
        const response = await http.GetRequest<SuggestedEngagement[] | SuggestedEngagementWithAttachment[]>(url, {
            params: { attach: attach?.toString() || false },
        });
        if (response.data) {
            return response.data;
        }
        throw new Error('Failed to fetch suggested engagements');
    } catch (e: unknown) {
        if (axios.isAxiosError<ApiErrorBody>(e)) {
            throw new Error(e?.response?.data?.message);
        } else if (e instanceof Error) {
            throw new Error(e?.message);
        } else {
            throw new Error(String(e));
        }
    }
};

export const patchSuggestedEngagements = async (
    engagementId: number,
    suggestions: SuggestedEngagement[],
): Promise<SuggestedEngagement[]> => {
    const url = replaceAllInURL({
        URL: Endpoints.SuggestedEngagement.UPDATE,
        params: {
            engagement_id: String(engagementId),
        },
    });
    try {
        const response = await http.PutRequest<SuggestedEngagement[]>(url, suggestions);
        if (response.data) {
            return response.data;
        }
        throw new Error('Failed to update suggested engagements');
    } catch (e: unknown) {
        if (axios.isAxiosError<ApiErrorBody>(e)) {
            throw new Error(e?.response?.data?.message);
        } else if (e instanceof Error) {
            console.log('REGULAR ERROR OBJECT', e?.message);
            throw new Error(e?.message);
        } else {
            console.log('STRING', String(e));
            throw new Error(String(e));
        }
    }
};
