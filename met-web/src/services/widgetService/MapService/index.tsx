import http from 'apiManager/httpRequestHandler';
import { WidgetMap } from 'models/widgetMap';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { GeoJSON } from 'geojson';

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
    engagement_id: number;
    longitude: number;
    latitude: number;
    marker_label?: string;
    file?: File | undefined;
}

export const postMap = async (widget_id: number, data: PostMapRequest): Promise<WidgetMap> => {
    try {
        const url = replaceUrl(Endpoints.Maps.CREATE, 'widget_id', String(widget_id));
        const formdata = new FormData();
        if (data.file !== undefined) {
            formdata.append('file', data.file);
        }
        formdata.append('engagement_id', data.engagement_id.toString());
        formdata.append('latitude', data.latitude.toString());
        formdata.append('longitude', data.longitude.toString());
        formdata.append('marker_label', data.marker_label ? data.marker_label : '');
        const response = await http.PostRequest<WidgetMap>(url, formdata);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create map');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PreviewShapefileRequest {
    file?: File | undefined;
}

export const previewShapeFile = async (data: PreviewShapefileRequest): Promise<GeoJSON> => {
    try {
        const formdata = new FormData();
        if (data.file !== undefined) {
            formdata.append('file', data.file);
        }
        const response = await http.PostRequest<GeoJSON>(Endpoints.Maps.SHAPEFILE_PREVIEW, formdata);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to preview shapefile');
    } catch (err) {
        return Promise.reject(err);
    }
};
