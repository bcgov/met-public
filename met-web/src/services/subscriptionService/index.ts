import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Subscribe, SubscribeTypeLabel, Unsubscribe } from 'models/subscription';

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

interface SubscribeFormProps {
    widget_id: number;
    description?: string;
    cta_type?: string;
    cta_text?: string;
    form_type: SubscribeTypeLabel;
}

export const createSubscribeForm = async (widget_id: number, data: SubscribeFormProps): Promise<Subscribe> => {
    try {
        const url = replaceUrl(Endpoints.Subscription.CREATE_FORM, 'widget_id', String(widget_id));
        const response = await http.PostRequest<Subscribe>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create subscribe form');
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
