import { setEngagements } from './engagementSlice';
import { httpGETRequest, httpPOSTRequest, httpPUTRequest } from '../../components/common/http-common.ts';
import { AnyAction, Dispatch } from 'redux';
import { Engagement } from '../../models/engagement';
import { PostEngagementRequest, PutEngagementRequest } from './types';
import API from '../../apiManager/endpoints';
import { replaceUrl } from '../../helper';

export const fetchAll = async (dispatch: Dispatch<AnyAction>): Promise<Engagement[]> => {
    const responseData = await httpGETRequest(API.MET_GET_ENGAGEMENTS);
    dispatch(setEngagements(responseData.data));
    return responseData.data;
};

export const getEngagement = async (
    engagementId: number,
    successCallback: (data: Engagement) => void,
    errorCallback: (errorMessage: string) => void,
) => {
    try {
        const url = replaceUrl(API.MET_GET_ENGAGEMENT, '<engagement_id>', String(engagementId));
        if (!engagementId || isNaN(Number(engagementId))) {
            throw new Error('Invalid Engagement Id ' + engagementId);
        }
        const responseData = await httpGETRequest(url);
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
        await httpPOSTRequest(API.MET_CREATE_ENGAGEMENT, data);
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
        const response = await httpPUTRequest(API.MET_UPDATE_ENGAGEMENT, data);
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
