import { setEngagements } from './engagementSlice';
import http from '../../apiManager/httpRequestHandler';
import { AnyAction, Dispatch } from 'redux';
import { Engagement } from '../../models/engagement';
import { PostEngagementRequest, PutEngagementRequest } from './types';
import Endpoints from '../../apiManager/endpoints';
import { replaceUrl } from '../../helper';

export const fetchAll = async (dispatch: Dispatch<AnyAction>): Promise<Engagement[]> => {
    const responseData = await http.GetRequest(Endpoints.Engagement.GET_ALL);
    dispatch(setEngagements(responseData.data));
    return responseData.data;
};

export const getEngagement = async (
    engagementId: number,
    successCallback: (data: Engagement) => void,
    errorCallback: (errorMessage: string) => void,
) => {
    try {
        const url = replaceUrl(Endpoints.Engagement.GET, '<engagement_id>', String(engagementId));
        if (!engagementId || isNaN(Number(engagementId))) {
            throw new Error('Invalid Engagement Id ' + engagementId);
        }
        const responseData = await http.GetRequest(url);
        successCallback(responseData.data);
    } catch (e: unknown) {
        let errorMessage = '';
        if (typeof e === 'string') {
            errorMessage = e.toUpperCase();
        } else if (e instanceof Error) {
            errorMessage = e.message;
        }
        errorCallback(errorMessage);
    }
};

export const postEngagement = async (
    data: PostEngagementRequest,
    successCallback: () => void,
    errorCallback: (errorMessage: string) => void,
) => {
    try {
        await http.PostRequest(Endpoints.Engagement.CREATE, data);
        successCallback();
    } catch (e: unknown) {
        let errorMessage = '';
        if (typeof e === 'string') {
            errorMessage = e.toUpperCase();
        } else if (e instanceof Error) {
            errorMessage = e.message;
        }
        errorCallback(errorMessage);
    }
};

export const putEngagement = async (
    data: PutEngagementRequest,
    successCallback: (data: Engagement) => void,
    errorCallback: (errorMessage: string) => void,
) => {
    try {
        const response = await http.PutRequest(Endpoints.Engagement.UPDATE, data);
        successCallback(response.data);
    } catch (e: unknown) {
        let errorMessage = '';
        if (typeof e === 'string') {
            errorMessage = e.toUpperCase();
        } else if (e instanceof Error) {
            errorMessage = e.message;
        }
        errorCallback(errorMessage);
    }
};
