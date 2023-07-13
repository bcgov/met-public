import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';
import { VideoWidget } from 'models/videoWidget';

export const fetchVideoWidgets = async (widget_id: number): Promise<VideoWidget[]> => {
    try {
        const url = replaceUrl(Endpoints.VideoWidgets.GET, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<VideoWidget[]>(url);
        return responseData.data ?? [];
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostVideoRequest {
    widget_id: number;
    engagement_id: number;
    video_url: string;
    description: string;
}

export const postVideo = async (widget_id: number, data: PostVideoRequest): Promise<VideoWidget> => {
    try {
        const url = replaceUrl(Endpoints.VideoWidgets.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<VideoWidget>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create video widget');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PatchVideoRequest {
    video_url?: string;
    description?: string;
}

export const patchVideo = async (
    widget_id: number,
    video_widget_id: number,
    data: PatchVideoRequest,
): Promise<VideoWidget> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.VideoWidgets.UPDATE,
            params: {
                widget_id: String(widget_id),
                video_widget_id: String(video_widget_id),
            },
        });
        const response = await http.PatchRequest<VideoWidget>(url, data);
        if (response.data) {
            return response.data;
        }
        return Promise.reject('Failed to create video widget');
    } catch (err) {
        return Promise.reject(err);
    }
};
