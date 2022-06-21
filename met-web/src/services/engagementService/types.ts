import { Engagement } from 'models/engagement';

export interface EngagementState {
    allEngagements: Engagement[];
}

export interface PostEngagementRequest {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    rich_description: string;
}

export interface PutEngagementRequest {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    rich_description: string;
}
