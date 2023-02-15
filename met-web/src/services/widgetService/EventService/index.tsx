import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Event, EventType } from 'models/event';

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
    type: EventType;
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
        return Promise.reject('Failed to create document');
    } catch (err) {
        return Promise.reject(err);
    }
};
