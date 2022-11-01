import { Status } from './status';

export type CommentStatusType = 'Pending' | 'Approved' | 'Rejected';

export const CommentStatus = Object.freeze({
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
});

export interface Comment {
    id: number;
    survey_id: number;
    submission_date: string;
    published_date: string;
    status_id: number;
    text: string;
    reviewed_by: string;
    review_date: string;
    comment_status: Status;
    survey: string;
    submission_id: number;
    question: string;
}

export const createDefaultComment = (): Comment => {
    return {
        id: 0,
        survey_id: 0,
        submission_date: '',
        published_date: '',
        status_id: 1,
        text: '',
        reviewed_by: '',
        review_date: '',
        comment_status: { id: 0, status_name: '' },
        survey: '',
        submission_id: 0,
        question: '',
    };
};
