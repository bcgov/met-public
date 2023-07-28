import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl, replaceAllInURL } from 'helper';
import { Subscribe, SubscribeForm, SubscribeTypeLabel, Unsubscribe } from 'models/subscription';

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

export const createSubscription = async (request: Subscription): Promise<Subscribe> => {
    try {
        const response = await http.PostRequest<Subscribe>(Endpoints.Subscription.CREATE_UPDATE, request);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const confirmSubscription = async (request: Subscribe): Promise<Subscribe> => {
    try {
        const response = await http.PatchRequest<Subscribe>(Endpoints.Subscription.CONFIRM_SUBSCRIPTION, request);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const unSubscribe = async (request: Unsubscribe): Promise<Unsubscribe> => {
    try {
        const response = await http.PatchRequest<Unsubscribe>(Endpoints.Subscription.UNSUBSCRIBE, request);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getSubscriptionsForms = async (widget_id: number): Promise<SubscribeForm[]> => {
    try {
        const url = replaceUrl(Endpoints.Subscription.GET_FORM_LIST, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<SubscribeForm[]>(url);
        return responseData.data || [];
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostSubscribeProps {
    widget_id: number;
    title?: string;
    type: SubscribeTypeLabel;
    items: {
        description?: string;
        call_to_action_type?: string;
        call_to_action_text?: string;
        form_type: SubscribeTypeLabel;
    }[];
}

export const postSubscribeForm = async (widget_id: number, data: PostSubscribeProps): Promise<SubscribeForm> => {
    try {
        const url = replaceUrl(Endpoints.Subscription.CREATE_FORM, 'widget_id', String(widget_id));
        const response = await http.PostRequest<SubscribeForm>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create subscription');
    } catch (err) {
        return Promise.reject(err);
    }
};

export interface PatchSubscribeProps {
    widget_id: number;
    title?: string;
    type: SubscribeTypeLabel;
    items: {
        description?: string;
        call_to_action_type?: string;
        call_to_action_text?: string;
        form_type: SubscribeTypeLabel;
    }[];
}

export const patchSubscribeForm = async (
    widget_id: number,
    subscribe_id: number,
    item_id: number,
    data: PatchSubscribeProps,
): Promise<SubscribeForm> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Subscription.UPDATE_FORM,
            params: {
                widget_id: String(widget_id),
                subscribe_id: String(subscribe_id),
                item_id: String(item_id),
            },
        });
        const response = await http.PatchRequest<SubscribeForm>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to patch subscribe');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteSubscribeForm = async (widget_id: number, subscribe_id: number): Promise<SubscribeForm> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Subscription.DELETE_FORM,
            params: {
                widget_id: String(widget_id),
                subscribe_id: String(subscribe_id),
            },
        });
        const response = await http.DeleteRequest<SubscribeForm>(url);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to delete subscribe');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const sortWidgetSubscribeForms = async (widget_id: number, data: Subscribe[]): Promise<SubscribeForm> => {
    try {
        const url = replaceUrl(Endpoints.Subscription.SORT_FORMS, 'widget_id', String(widget_id));
        const response = await http.PatchRequest<SubscribeForm>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to update sort order');
    } catch (err) {
        return Promise.reject(err);
    }
};
