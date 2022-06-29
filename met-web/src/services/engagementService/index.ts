import { setEngagements } from './engagementSlice';
import http from 'apiManager/httpRequestHandler';
import { AnyAction, Dispatch } from 'redux';
import { Engagement } from 'models/engagement';
import { PostEngagementRequest, PutEngagementRequest } from './types';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const fetchAll = async (dispatch: Dispatch<AnyAction>): Promise<Engagement[]> => {
    const responseData = await http.GetRequest<Engagement[]>(Endpoints.Engagement.GET_ALL);
    const engagements = responseData.data.result ?? [];
    dispatch(setEngagements(engagements));
    return engagements;
};

export const getEngagement = async (engagementId: number): Promise<Engagement> => {
    return new Promise((resolve, reject) => {
        const url = replaceUrl(Endpoints.Engagement.GET, '<engagement_id>', String(engagementId));
        if (!engagementId || isNaN(Number(engagementId))) {
            reject('Invalid Engagement Id ' + engagementId);
        }
        http.GetRequest<Engagement>(url)
            .then((response) => {
                if (response.data.result) {
                    resolve(response.data.result);
                } else {
                    reject(response.data.message ?? 'Failed to fetch engagement');
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const postEngagement = async (data: PostEngagementRequest): Promise<Engagement> => {
    return new Promise((resolve, reject) => {
        http.PostRequest<Engagement>(Endpoints.Engagement.CREATE, data)
            .then((response) => {
                if (response.data.status && response.data.result) {
                    resolve(response.data.result);
                }
                reject(response.data.message ?? 'Failed to create engagement');
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const putEngagement = (data: PutEngagementRequest): Promise<Engagement> => {
    return new Promise((resolve, reject) => {
        http.PutRequest<Engagement>(Endpoints.Engagement.UPDATE, data)
            .then((response) => {
                if (response.data.status && response.data.result) {
                    resolve(response.data.result);
                }
                reject(response.data.message ?? 'Failed to update engagement');
            })
            .catch((err) => {
                reject(err);
            });
    });
};
