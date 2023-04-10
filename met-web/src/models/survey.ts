import { FormBuilderData } from 'components/Form/types';
import { createDefaultEngagement, Engagement } from './engagement';

export interface Survey {
    id: number;
    name: string;
    responseCount: number;
    created_date: string;
    is_hidden: boolean;
    engagement?: Engagement;
    form_json?: FormBuilderData;
    comments?: unknown;
    comments_meta_data: SurveyCommentData;
    engagement_id: number;
    engagement_status_id?: number;
}

export interface SurveyCommentData {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    needs_further_review: number;
}

export interface SurveySubmissionData {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    needs_further_review: number;
}

export const createDefaultSurvey = (): Survey => {
    return {
        id: 0,
        name: '',
        responseCount: 0,
        created_date: '',
        is_hidden: false,
        engagement: createDefaultEngagement(),
        comments_meta_data: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            needs_further_review: 0,
        },
        engagement_id: 0,
    };
};
