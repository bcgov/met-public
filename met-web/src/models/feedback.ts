export interface Feedback {
    rating: number;
    comment: string;
    commentType: string;
}

export const createDefaultFeedback = (): Feedback => {
    return {
        rating: 0,
        comment: '',
        commentType: '',
    };
};
