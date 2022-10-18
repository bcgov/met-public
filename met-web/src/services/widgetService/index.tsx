import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Widget, WidgetsList } from 'models/widget';

export const getWidgets = async (engagement_id: number): Promise<WidgetsList[]> => {
    const url = replaceUrl(Endpoints.Widgets.GET_LIST, 'engagement_id', String(engagement_id));
    const responseData = await http.GetRequest<WidgetsList[]>(url);
    return responseData.data.result ?? [];
};

interface PostWidget {
    widget_type_id: number;
    engagement_id: number;
}
export const postWidget = async (engagement_id: number, data: PostWidget): Promise<Widget[]> => {
    try {
        const url = replaceUrl(Endpoints.Widgets.CREATE, 'engagement_id', String(engagement_id));
        const response = await http.PostRequest<Widget[]>(url, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostWidgetItemRequest {
    widget_id: number;
    widget_data_id: number;
}
export const postWidgetItems = async (widget_id: number, data: PostWidgetItemRequest[]): Promise<Widget[]> => {
    try {
        const url = replaceUrl(Endpoints.Widget_items.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<Widget[]>(url, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create contact');
    } catch (err) {
        return Promise.reject(err);
    }
};
