export interface Feedback {
    rating: number;
    comment: string;
    comment_type: CommentTypeEnum;
}

export enum CommentTypeEnum {
    None = 0,
    Issue = 1,
    Idea = 2,
    Else = 3,
}

export const createDefaultFeedback = (): Feedback => {
    return {
        rating: 0,
        comment: '',
        comment_type: CommentTypeEnum.None,
    };
};
