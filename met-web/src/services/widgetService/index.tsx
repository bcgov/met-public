import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl, replaceAllInURL } from 'helper';
import { WidgetItem, Widget } from 'models/widget';

export const getWidgets = async (engagement_id: number): Promise<Widget[]> => {
    const url = replaceUrl(Endpoints.Widgets.GET_LIST, 'engagement_id', String(engagement_id));
    const responseData = await http.GetRequest<Widget[]>(url);
    return responseData.data ?? [];
};

interface PostWidget {
    widget_type_id: number;
    engagement_id: number;
}
/**
 * @deprecated The method was replaced by Redux RTK query to have caching behaviour
 */
export const postWidget = async (engagement_id: number, data: PostWidget): Promise<Widget> => {
    try {
        const url = replaceUrl(Endpoints.Widgets.CREATE, 'engagement_id', String(engagement_id));
        const response = await http.PostRequest<Widget>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostWidgetItemRequest {
    widget_id: number;
    widget_data_id: number;
}
/**
 * @deprecated The method was replaced by Redux RTK query to have caching behaviour
 */
export const postWidgetItems = async (widget_id: number, data: PostWidgetItemRequest[]): Promise<WidgetItem[]> => {
    try {
        const url = replaceUrl(Endpoints.Widget_items.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<WidgetItem[]>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create wdiget item');
    } catch (err) {
        return Promise.reject(err);
    }
};

/**
 * @deprecated The method was replaced by Redux RTK query to have caching behaviour
 */
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
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to delete widget');
    } catch (err) {
        return Promise.reject(err);
    }
};

/**
 * @deprecated The method was replaced by Redux RTK query to have caching behaviour
 */
export const sortWidgets = async (engagement_id: number, data: Widget[]): Promise<void> => {
    try {
        const url = replaceUrl(Endpoints.Widgets.SORT, 'engagement_id', String(engagement_id));
        await http.PatchRequest<Widget>(url, data);
    } catch (err) {
        return Promise.reject(err);
    }
};
