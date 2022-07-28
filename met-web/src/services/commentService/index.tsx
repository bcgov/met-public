import http from 'apiManager/httpRequestHandler';
import { Comment } from 'models/comment';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL, replaceUrl } from 'helper';

interface FetchCommentParams {
    unlinked?: boolean;
}
export const fetchComments = async (params: FetchCommentParams = {}): Promise<Comment[]> => {
    const responseData = await http.GetRequest<Comment[]>(Endpoints.Comment.GET_ALL, params);
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

interface PostCommentRequest {
    name: string;
    components?: unknown[];
    engagement_id?: string;
    form_json: unknown;
}
export const postComment = async (data: PostCommentRequest): Promise<Comment> => {
    try {
        const response = await http.PostRequest<Comment>(Endpoints.Comment.CREATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create comment');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PutCommentRequest {
    id: string;
    form_json: unknown;
}
export const putComment = async (data: PutCommentRequest): Promise<Comment> => {
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

interface LinkPutCommentRequest {
    id: string;
    engagement_id: string;
}
export const linkComment = async (params: LinkPutCommentRequest): Promise<Comment> => {
    try {
        const url = replaceAllInURL({
            URL: Endpoints.Comment.LINK_TO_ENGAGEMENT,
            params: {
                comment_id: params.id,
                engagement_id: params.engagement_id,
            },
        });

        const response = await http.PutRequest<Comment>(url);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update comment');
    } catch (err) {
        return Promise.reject(err);
    }
};
