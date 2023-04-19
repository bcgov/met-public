export enum CommentStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3,
    NeedsFurtherReview = 4,
}

export const COMMENTS_STATUS = {
    [CommentStatus.Pending]: 'Pending',
    [CommentStatus.Approved]: 'Approved',
    [CommentStatus.Rejected]: 'Rejected',
    [CommentStatus.NeedsFurtherReview]: 'Needs Further Review',
};
