export interface Feedback {
    created_date: string;
    rating: number;
    comment: string;
    comment_type: CommentTypeEnum;
    source: SourceTypeEnum;
}

export enum RatingTypeEnum {
    None = 0,
}

export enum CommentTypeEnum {
    None = 0,
    Issue = 1,
    Idea = 2,
    Else = 3,
}

export enum SourceTypeEnum {
    Public = 0,
    Internal = 1,
}

export const createDefaultFeedback = (): Feedback => {
    return {
        rating: 0,
        comment: '',
        comment_type: CommentTypeEnum.None,
        created_date: '',
        source: SourceTypeEnum.Public,
    };
};
