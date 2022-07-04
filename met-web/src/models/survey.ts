import { Engagement } from './engagement';
export interface Survey {
    id: number;
    name: string;
    responseCount: number;
    created_date: string;
    published_date: string;
    engagement_name: string;
    status: string;
    engagement?: Engagement;
}
