import http from 'apiManager/httpRequestHandler';
import { WidgetMap } from 'models/widgetMap';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';

export const fetchMaps = async (widget_id: number): Promise<WidgetMap[]> => {
    try {
        const url = replaceUrl(Endpoints.Maps.GET_LIST, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<WidgetMap[]>(url);
        return responseData.data ?? [];
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostMapRequest {
    widget_id: number;
    longitude: number;
    latitude: number;
    description?: string;
}
export const postMap = async (widget_id: number, data: PostMapRequest): Promise<WidgetMap> => {
    try {
        const url = replaceUrl(Endpoints.Maps.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<WidgetMap>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create map');
    } catch (err) {
        return Promise.reject(err);
    }
};
