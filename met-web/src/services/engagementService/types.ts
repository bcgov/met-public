import { Engagement } from 'models/engagement';

export interface EngagementState {
    allEngagements: Engagement[];
}

export interface PostEngagementRequest {
    name: string;
    start_date: string;
    status_id: number;
    end_date: string;
    description: string;
    rich_description: string;
    content: string;
    rich_content: string;
}

export interface PutEngagementRequest {
    id: number;
    name: string;
    start_date: string;
    status_id: number;
    end_date: string;
    description: string;
    rich_description: string;
    content: string;
    rich_content: string;
}
