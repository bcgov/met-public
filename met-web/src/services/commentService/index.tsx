import http from 'apiManager/httpRequestHandler';
import { Comment } from 'models/comment';
import Endpoints from 'apiManager/endpoints';

import { replaceUrl } from 'helper';

interface FetchCommentParams {
    survey_id: number;
}
export const fetchComments = async ({ survey_id }: FetchCommentParams): Promise<Comment[]> => {
    const url = replaceUrl(Endpoints.Comment.GET_ALL, 'survey_id', String(survey_id));
    const responseData = await http.GetRequest<Comment[]>(url);
    return responseData.data.result ?? [];
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

interface UpdateCommentRequest {
    id: string;
    survey_id: number;
}
export const UpdateComment = async (data: UpdateCommentRequest): Promise<Comment> => {
    try {
        const response = await http.PutRequest<Comment>(Endpoints.Comment.UPDATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update comment');
    } catch (err) {
        return Promise.reject(err);
    }
};
