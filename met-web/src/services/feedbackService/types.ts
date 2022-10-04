export interface GetFeedbackRequest {
    page?: number;
    size?: number;
    sort_key?: string;
    sort_order?: 'asc' | 'desc';
    search_text?: string;
}

export interface PostFeedbackRequest {
    rating: number;
    comment_type: number;
    comment: string;
}
