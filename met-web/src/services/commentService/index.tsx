import http from 'apiManager/httpRequestHandler';
import { Comment } from 'models/comment';
import Endpoints from 'apiManager/endpoints';

import { replaceUrl } from 'helper';
import { Page } from 'services/type';

interface FetchCommentParams {
    survey_id: number;
}
export const fetchComments = async ({ survey_id }: FetchCommentParams): Promise<Comment[]> => {
    const url = replaceUrl(Endpoints.Comment.GET_LIST, 'survey_id', String(survey_id));
    const responseData = await http.GetRequest<Comment[]>(url);
    return responseData.data.result ?? [];
};

interface GetCommentsParams {
    survey_id: number;
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
}
export const getCommentsPage = async ({
    survey_id,
    page,
    size,
    sort_key,
    sort_order,
    search_text,
}: GetCommentsParams): Promise<Page<Comment>> => {
    const url = replaceUrl(Endpoints.Comment.GET_LIST, 'survey_id', String(survey_id));
    const responseData = await http.GetRequest<Page<Comment>>(url, { page, size, sort_key, sort_order, search_text });
    return (
        responseData.data.result ?? {
            items: [],
            total: 0,
        }
    );
};

export const getSubmissionComments = async (submissionId: number): Promise<Comment[]> => {
    const url = replaceUrl(Endpoints.Comment.GET_SUBMISSION, 'submission_id', String(submissionId));
    if (!submissionId || isNaN(Number(submissionId))) {
        return Promise.reject('Invalid Submission Id ' + submissionId);
    }
    try {
        const response = await http.GetRequest<Comment[]>(url);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch comments');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getComment = async (commentId: number): Promise<Comment> => {
    const url = replaceUrl(Endpoints.Comment.GET, 'comment_id', String(commentId));
    if (!commentId || isNaN(Number(commentId))) {
        return Promise.reject('Invalid Comment Id ' + commentId);
    }
    try {
        const response = await http.GetRequest<Comment>(url);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch comment');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface ReviewCommentRequest {
    status_id: number;
    submission_id: number;
}
export const ReviewComment = async ({ submission_id, status_id }: ReviewCommentRequest): Promise<Comment> => {
    try {
        const url = replaceUrl(Endpoints.Comment.REVIEW, 'submission_id', String(submission_id));
        const response = await http.PutRequest<Comment>(url, { status_id });
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update comments');
    } catch (err) {
        return Promise.reject(err);
    }
};
