import { EngagementViewSections } from 'components/engagement/public/view';
import { SubmissionStatusTypes } from 'constants/engagementStatus';

export interface EngagementStatusBlock {
    survey_status: SubmissionStatusTypes;
    block_text: string;
    button_text?: string;
    link_type: string;
    internal_link?: string;
    external_link?: string;
}

export const createDefaultStatusBlock = (): EngagementStatusBlock => {
    return {
        survey_status: 'Upcoming',
        block_text: '',
        link_type: 'internal',
        internal_link: EngagementViewSections.PROVIDE_FEEDBACK,
        external_link: '',
    };
};
