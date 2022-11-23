import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl, replaceAllInURL } from 'helper';
import { WidgetItem, Widget } from 'models/widget';

export const getWidgets = async (engagement_id: number): Promise<Widget[]> => {
    const url = replaceUrl(Endpoints.Widgets.GET_LIST, 'engagement_id', String(engagement_id));
    const responseData = await http.GetRequest<Widget[]>(url);
    return responseData.data.result ?? [];
};

interface PostWidget {
    widget_type_id: number;
    engagement_id: number;
}
export const postWidget = async (engagement_id: number, data: PostWidget): Promise<Widget> => {
    try {
        const url = replaceUrl(Endpoints.Widgets.CREATE, 'engagement_id', String(engagement_id));
        const response = await http.PostRequest<Widget>(url, data);
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
export const postWidgetItem = async (widget_id: number, data: PostWidgetItemRequest): Promise<WidgetItem> => {
    try {
        const url = replaceUrl(Endpoints.Widget_items.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<WidgetItem>(url, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const postWidgetItems = async (widget_id: number, data: PostWidgetItemRequest[]): Promise<WidgetItem[]> => {
    try {
        const url = replaceUrl(Endpoints.Widget_items.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<WidgetItem[]>(url, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const removeWidget = async (engagement_id: number, widget_id: number): Promise<Widget[]> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Widgets.DELETE,
            params: {
                engagement_id: String(engagement_id),
                widget_id: String(widget_id),
            },
        });
        const response = await http.DeleteRequest<Widget[]>(url);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to delete widget');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const sortWidgets = async (engagement_id: number, sort_index: number): Promise<Widget> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Widgets.SORT,
            params: {
                engagement_id: String(engagement_id),
                sort_index: String(sort_index),
            },
        });
        const response = await http.PatchRequest<Widget>(url);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to sort widgets');
    } catch (err) {
        return Promise.reject(err);
    }
};
