export type CommentStatus = 'Pending' | 'Review' | 'Published' | 'Rejected';

export interface Comment {
    id: number;
    survey_id: number;
    email: string;
    comment_date: string;
    published_date: string;
    status: CommentStatus;
    content: string;
    reviewed_by: string;
    date_reviewed: string;
}

export const createDefaultComment = (): Comment => {
    return {
        id: 0,
        survey_id: 0,
        email: '',
        comment_date: '',
        published_date: 'Sent for Review',
        status: 'Pending',
        content: '',
        reviewed_by: '',
        date_reviewed: '',
    };
};
