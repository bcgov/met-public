import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Subscribe, Unsubscribe } from 'models/subscription';

export const getSubscription = async (participant_id: number): Promise<Subscribe> => {
    if (!participant_id) {
        return Promise.reject('Invalid User Id');
    }
    const url = replaceUrl(Endpoints.Subscription.GET, 'participant_id', String(participant_id));
    const response = await http.GetRequest<Subscribe>(url);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch subscription');
};

export const createSubscription = async (request: Subscribe): Promise<Subscribe> => {
    try {
        const response = await http.PostRequest<Subscribe>(Endpoints.Subscription.CREATE_UPDATE, request);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const unSubscribe = async (request: Unsubscribe): Promise<Unsubscribe> => {
    try {
        const response = await http.PatchRequest<Unsubscribe>(Endpoints.Subscription.UPDATE, request);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};
