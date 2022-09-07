import { setEngagements } from './engagementSlice';
import http from 'apiManager/httpRequestHandler';
import { AnyAction, Dispatch } from 'redux';
import { Engagement } from 'models/engagement';
import { PostEngagementRequest, PutEngagementRequest } from './types';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Page } from 'services/type';

export const fetchAll = async (dispatch: Dispatch<AnyAction>): Promise<Engagement[]> => {
    const responseData = await http.GetRequest<Engagement[]>(Endpoints.Engagement.GET_LIST);
    const engagements = responseData.data.result ?? [];
    dispatch(setEngagements(engagements));
    return engagements;
};

interface GetEngagementsParams {
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
}
export const getEngagements = async (params: GetEngagementsParams = {}): Promise<Page<Engagement>> => {
    const responseData = await http.GetRequest<Page<Engagement>>(Endpoints.Engagement.GET_LIST, params);
    return (
        responseData.data.result ?? {
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
    try {
        const response = await http.GetRequest<Engagement>(url);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch engagement');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const postEngagement = async (data: PostEngagementRequest): Promise<Engagement> => {
    try {
        const response = await http.PostRequest<Engagement>(Endpoints.Engagement.CREATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create engagement');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const putEngagement = async (data: PutEngagementRequest): Promise<Engagement> => {
    try {
        const response = await http.PutRequest<Engagement>(Endpoints.Engagement.UPDATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update engagement');
    } catch (err) {
        return Promise.reject(err);
    }
};
