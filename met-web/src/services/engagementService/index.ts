import { setEngagements } from './engagementSlice';
import http from 'apiManager/httpRequestHandler';
import { AnyAction, Dispatch } from 'redux';
import { Engagement } from 'models/engagement';
import { PatchEngagementRequest, PostEngagementRequest, PutEngagementRequest } from './types';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Page } from 'services/type';

export const fetchAll = async (dispatch: Dispatch<AnyAction>): Promise<Engagement[]> => {
    const responseData = await http.GetRequest<Engagement[]>(Endpoints.Engagement.GET_LIST);
    const engagements = responseData.data ?? [];
    dispatch(setEngagements(engagements));
    return engagements;
};

interface GetEngagementsParams {
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
    engagement_status?: number[];
    created_from_date?: string;
    created_to_date?: string;
    published_from_date?: string;
    published_to_date?: string;
    include_banner_url?: boolean;
    has_team_access?: boolean;
    metadata?: string;
}
export const getEngagements = async (params: GetEngagementsParams = {}): Promise<Page<Engagement>> => {
    const responseData = await http.GetRequest<Page<Engagement>>(Endpoints.Engagement.GET_LIST, params);
    return (
        responseData.data ?? {
            items: [],
            total: 0,
        }
    );
};

export const getEngagement = async (engagementId: number): Promise<Engagement> => {
    const url = replaceUrl(Endpoints.Engagement.GET, 'engagement_id', String(engagementId));
    if (!engagementId || isNaN(Number(engagementId))) {
        return Promise.reject('Invalid Engagement Id ' + engagementId);
    }
    const response = await http.GetRequest<Engagement>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch engagement');
};

export const postEngagement = async (data: PostEngagementRequest): Promise<Engagement> => {
    const response = await http.PostRequest<Engagement>(Endpoints.Engagement.CREATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to create engagement');
};

export const putEngagement = async (data: PutEngagementRequest): Promise<Engagement> => {
    const response = await http.PutRequest<Engagement>(Endpoints.Engagement.UPDATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement');
};

export const patchEngagement = async (data: PatchEngagementRequest): Promise<Engagement> => {
    const response = await http.PatchRequest<Engagement>(Endpoints.Engagement.UPDATE, data);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update engagement');
};
