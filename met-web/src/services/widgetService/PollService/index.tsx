import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';
import { PollWidget, PollAnswer, PollResponse, PollResultResponse } from 'models/pollWidget';

interface PostPollRequest {
    widget_id: number;
    engagement_id: number;
    title: string;
    description: string;
    answers: PollAnswer[];
    status: string;
}

interface PostPollResponse {
    selected_answer_id: number;
}

interface PatchPollRequest {
    answers?: PollAnswer[];
    title?: string;
    description?: string;
    status?: string;
}

export const postPoll = async (widget_id: number, data: PostPollRequest): Promise<PollWidget> => {
    try {
        const url = replaceUrl(Endpoints.PollWidgets.CREATE, 'widget_id', String(widget_id));
        const response = await http.PostRequest<PollWidget>(url, data);
        return response.data || Promise.reject('Failed to create Poll widget');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const patchPoll = async (widget_id: number, poll_id: number, data: PatchPollRequest): Promise<PollWidget> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.PollWidgets.UPDATE,
            params: {
                widget_id: String(widget_id),
                poll_id: String(poll_id),
            },
        });
        const response = await http.PatchRequest<PollWidget>(url, data);
        return response.data || Promise.reject('Failed to update Poll widget');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const fetchPollWidgets = async (widget_id: number): Promise<PollWidget[]> => {
    try {
        const url = replaceUrl(Endpoints.PollWidgets.GET, 'widget_id', String(widget_id));
        const responseData = await http.GetRequest<PollWidget[]>(url);
        return responseData.data ?? [];
    } catch (err) {
        return Promise.reject(err);
    }
};

export const postPollResponse = async (
    widget_id: number,
    poll_id: number,
    data: PostPollResponse,
): Promise<PollResponse> => {
    try {
        let url = replaceUrl(Endpoints.PollWidgets.RECORD_RESPONSE, 'widget_id', String(widget_id));
        url = replaceUrl(url, 'poll_id', String(poll_id));
        const response = await http.PostRequest<PollResponse>(url, data);
        return response.data || Promise.reject('Failed to create Poll Response');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const fetchPollResults = async (widget_id: number, poll_id: number): Promise<PollResultResponse> => {
    try {
        let url = replaceUrl(Endpoints.PollWidgets.RECORD_RESPONSE, 'widget_id', String(widget_id));
        url = replaceUrl(url, 'poll_id', String(poll_id));
        const response = await http.GetRequest<PollResultResponse>(url);
        return response.data || Promise.reject('Failed to fetch Poll Results');
    } catch (err) {
        return Promise.reject(err);
    }
};
