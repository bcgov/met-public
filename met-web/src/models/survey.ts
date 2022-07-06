import { Engagement } from './engagement';
export interface Survey {
    id: number;
    name: string;
    responseCount: number;
    created_date: string;
    engagement?: Engagement;
    form?: unknown;
    form_json?: unknown;
}
