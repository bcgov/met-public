import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl, replaceAllInURL } from 'helper';
import { Event, EventTypeLabel } from 'models/event';

export const getEvents = async (widget_id: number): Promise<Event[]> => {
    try {
        const url = replaceUrl(Endpoints.Events.GET_LIST, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<Event[]>(url);
        return responseData.data || [];
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostEventProps {
    widget_id: number;
    title?: string;
    type: EventTypeLabel;
    items: {
        description?: string;
        location_name?: string;
        location_address?: string;
        start_date: string;
        end_date: string;
        url?: string;
        url_label?: string;
    }[];
}
export const postEvent = async (widget_id: number, data: PostEventProps): Promise<Event> => {
    try {
        const url = replaceUrl(Endpoints.Events.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<Event>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create event');
    } catch (err) {
        return Promise.reject(err);
    }
};

export interface PatchEventProps {
    id: number;
    description?: string;
    location_name?: string;
    location_address?: string;
    start_date?: string;
    end_date?: string;
    url?: string;
    url_label?: string;
}
[];

export const patchEvent = async (widget_id: number, data: PatchEventProps): Promise<Event> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Events.UPDATE,
            params: {
                event_id: String(data.id),
                widget_id: String(widget_id),
            },
        });
        const response = await http.PatchRequest<Event>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to patch event');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteEvent = async (widget_id: number, event_id: string): Promise<Event> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Events.DELETE,
            params: {
                event_id: String(event_id),
                widget_id: String(widget_id),
            },
        });
        const response = await http.DeleteRequest<Event>(url);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to delete event');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const sortWidgetEvents = async (widget_id: number, data: Event[]): Promise<Event> => {
    try {
        const url = replaceUrl(Endpoints.Events.SORT, 'widget_id', String(widget_id));
        const response = await http.PatchRequest<Event>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to update sort order');
    } catch (err) {
        return Promise.reject(err);
    }
};
