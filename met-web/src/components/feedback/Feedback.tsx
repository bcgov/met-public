export interface Feedback {
    id: number;
    feedback_id: FeedbackId;
    published_date: string;
    feedback_type: FeedbackType;
    message: string;
}

export type FeedbackId = 0 | 1 | 2 | 3;

export type FeedbackType = 'Issue' | 'Other' | 'Idea';

export const createDefaultFeedback = (): Feedback => {
    return {
        id: 0,
        feedback_id: 0,
        published_date: '',
        feedback_type: 'Issue',
        message: '',
    };
};
