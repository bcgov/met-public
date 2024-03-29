import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { Page } from 'services/type';
import { Feedback } from 'models/feedback';
import { GetFeedbackRequest, PostFeedbackRequest, UpdateFeedbackRequest } from './types';
import { replaceUrl } from 'helper';
export const getFeedbacksPage = async ({
    page,
    size,
    sort_key,
    sort_order,
    search_text,
    status,
}: GetFeedbackRequest): Promise<Page<Feedback>> => {
    const url = Endpoints.Feedback.GET_LIST;
    const response = await http.GetRequest<Page<Feedback>>(url, {
        page,
        size,
        sort_key,
        sort_order,
        search_text,
        status,
    });
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to fetch feedback page');
};

export const createFeedback = async (feedback: PostFeedbackRequest): Promise<Feedback> => {
    const url = Endpoints.Feedback.CREATE;
    const response = await http.PostRequest<Feedback>(url, feedback);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to create feedback');
};

export const updateFeedback = async (feedback_id: number, feedback: UpdateFeedbackRequest): Promise<Feedback> => {
    const url = replaceUrl(Endpoints.Feedback.UPDATE, 'feedback_id', String(feedback_id));
    const response = await http.PatchRequest<Feedback>(url, feedback);
    if (response.data) {
        return response.data;
    }
    return Promise.reject('Failed to update feedback');
};

export const deleteFeedback = async (feedback_id: number): Promise<void> => {
    const url = replaceUrl(Endpoints.Feedback.DELETE, 'feedback_id', String(feedback_id));
    const response = await http.DeleteRequest(url);
    if (response.status !== 200) {
        return Promise.reject('Failed to delete feedback');
    }
};
