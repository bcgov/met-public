import { FeedbackStatusEnum } from 'models/feedback';
import { string } from 'yup';

export interface GetFeedbackRequest {
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
    status?: FeedbackStatusEnum;
}

export interface PostFeedbackRequest {
    rating: number;
    comment_type: number;
    comment: string;
    status: FeedbackStatusEnum;
    submission_path: string;
}

export interface UpdateFeedbackRequest {
    rating?: number;
    comment_type?: number;
    comment?: string;
    status?: FeedbackStatusEnum;
    submission_path?: string;
}
