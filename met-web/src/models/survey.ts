import { FormBuilderData } from 'components/Form/types';
import { Engagement } from './engagement';
export interface Survey {
    id: number;
    name: string;
    responseCount: number;
    created_date: string;
    engagement: Engagement;
    form_json?: FormBuilderData;
    comments?: unknown;
}
