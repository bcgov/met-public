export interface Feedback {
    rating: number;
    comment: string;
    commentType: 'Issue' | 'Idea' | 'Else' | '';
}

export const createDefaultFeedback = (): Feedback => {
    return {
        rating: 0,
        comment: '',
        commentType: '',
    };
};
