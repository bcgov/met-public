export interface StaffNote {
    id: number;
    note: string;
    note_type: string;
    survey_id: number;
    submission_id: number;
}

export const createDefaultReviewNote = (): StaffNote => {
    return {
        id: 0,
        note: '',
        note_type: 'Review',
        survey_id: 0,
        submission_id: 0,
    };
};

export const createDefaultInternalNote = (): StaffNote => {
    return {
        id: 0,
        note: '',
        note_type: 'Internal',
        survey_id: 0,
        submission_id: 0,
    };
};
