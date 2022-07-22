import { FormBuilderData } from 'components/Form/types';
import { createDefaultEngagement, Engagement } from './engagement';

export interface Survey {
    id: number;
    name: string;
    responseCount: number;
    created_date: string;
    engagement: Engagement;
    form_json?: FormBuilderData;
    comments?: unknown;
}

export const createDefaultSurvey = (): Survey => {
    return {
        id: 0,
        name: '',
        responseCount: 0,
        created_date: '',
        engagement: createDefaultEngagement(),
    };
};
