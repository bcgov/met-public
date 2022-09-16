import { FormBuilderData } from 'components/Form/types';
import { createDefaultEngagement, Engagement } from './engagement';

export interface Survey {
    id: number;
    name: string;
    responseCount?: number;
    created_date: string;
    engagement?: Engagement;
    form_json?: FormBuilderData;
    comments?: unknown;
    comments_meta_data?: SurveyCommentData;
}

export interface SurveyCommentData {
    total: number;
    pending: number;
}

export interface SurveySubmissionData {
    total: number;
}

export const createDefaultSurvey = (): Survey => {
    return {
        id: 0,
        name: '',
        responseCount: 0,
        created_date: '',
        engagement: createDefaultEngagement(),
        comments_meta_data: {
            total: 0,
            pending: 0,
        },
    };
};
