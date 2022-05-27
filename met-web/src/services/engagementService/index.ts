import { setEngagements } from './engagementSlice';
import http from '../../components/common/http-common.ts';
import { Dispatch } from 'redux';
import UserService from '../userService';

export const fetchAll = async (dispatch: Dispatch<any>): Promise<Engagement[]> => {
    const responseData = await http.get<Engagement[]>('/engagement/', {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
    dispatch(setEngagements(responseData.data));
    return responseData.data;
};

export const getEngagement = async (engagementId: number, successCallback: Function) => {
    if (!engagementId) {
        throw new Error('Invalid Engagement Id ' + engagementId);
    }

    const responseData = await http.get<Engagement>(`/engagement/${engagementId}`, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${UserService.getToken()}`,
        },
    });
    successCallback(responseData.data);
};

export const postEngagement = async (
    data: PostEngagementRequest,
    successCallback: Function,
    errorCallback: Function,
) => {
    try {
        await http.post('/engagement/', data, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${UserService.getToken()}`,
            },
        });
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

export const putEngagement = async (data: PutEngagementRequest, successCallback: Function, errorCallback: Function) => {
    try {
        const response = await http.put('/engagement/', data, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${UserService.getToken()}`,
            },
        });
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
