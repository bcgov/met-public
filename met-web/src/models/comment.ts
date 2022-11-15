export interface Comment {
    id: number;
    survey_id: number;
    submission_date: string;
    published_date: string;
    text: string;
    submission_id: number;
    label: string;
    status_id: number;
    reviewed_by: string;
}

export const createDefaultComment = (): Comment => {
    return {
        id: 0,
        survey_id: 0,
        submission_date: '',
        published_date: '',
        text: '',
        submission_id: 0,
        label: '',
        status_id: 1,
        reviewed_by: '',
    };
};
