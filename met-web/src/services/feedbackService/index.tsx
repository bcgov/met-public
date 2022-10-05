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
    const responseData = await http.GetRequest<Page<Feedback>>(url, {
        page,
        size,
        sort_key,
        sort_order,
        search_text,
    });
    return (
        responseData.data.result ?? {
            items: [],
            total: 0,
        }
    );
};

export const createFeedback = async (feedback: PostFeedbackRequest): Promise<Feedback> => {
    try {
        const url = Endpoints.Feedback.CREATE;
        const response = await http.PostRequest<Feedback>(url, feedback);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create feedback');
    } catch (err) {
        return Promise.reject(err);
    }
};
