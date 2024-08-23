import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';
import { TimelineWidget, TimelineEvent } from 'models/timelineWidget';
import { WidgetLocation } from 'models/widget';

interface PostTimelineRequest {
    widget_id: number;
    engagement_id: number;
    title: string;
    description: string;
    events: TimelineEvent[];
    location: WidgetLocation | null;
}

interface PatchTimelineRequest {
    events?: TimelineEvent[];
    title?: string;
    description?: string;
}

export const postTimeline = async (widget_id: number, data: PostTimelineRequest): Promise<TimelineWidget> => {
    try {
        const url = replaceUrl(Endpoints.TimelineWidgets.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<TimelineWidget>(url, data);
        return response.data || Promise.reject('Failed to create timeline widget');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const patchTimeline = async (
    widget_id: number,
    timeline_id: number,
    data: PatchTimelineRequest,
): Promise<TimelineWidget> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.TimelineWidgets.UPDATE,
            params: {
                widget_id: String(widget_id),
                timeline_id: String(timeline_id),
            },
        });
        const response = await http.PatchRequest<TimelineWidget>(url, data);
        return response.data || Promise.reject('Failed to update timeline widget');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const fetchTimelineWidgets = async (widget_id: number): Promise<TimelineWidget[]> => {
    try {
        const url = replaceUrl(Endpoints.TimelineWidgets.GET, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<TimelineWidget[]>(url);
        return responseData.data ?? [];
    } catch (err) {
        return Promise.reject(err);
    }
};
