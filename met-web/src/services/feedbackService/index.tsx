import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { Page } from 'services/type';
import { Feedback } from 'models/feedback';
import { GetFeedbackRequest, PostFeedbackRequest } from './types';

export const getFeedbacksPage = async ({
    page,
    size,
    sort_key,
    sort_order,
    search_text,
}: GetFeedbackRequest): Promise<Page<Feedback>> => {
    const url = Endpoints.Feedback.GET_LIST;
    const response = await http.GetRequest<Page<Feedback>>(url, {
        page,
        size,
        sort_key,
        sort_order,
        search_text,
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
