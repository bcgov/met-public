import { SubmissionStatusTypes } from 'constants/engagementStatus';

export interface EngagementStatusBlock {
    survey_status: SubmissionStatusTypes;
    block_text: string;
}

export const createDefaultStatusBlock = (): EngagementStatusBlock => {
    return {
        survey_status: '',
        block_text: '',
    };
};
