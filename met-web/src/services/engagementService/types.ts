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
    content: string;
    rich_content: string;
    banner_filename?: string;
    status_block?: unknown[];
}

export interface PutEngagementRequest {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    rich_description: string;
    banner_filename?: string;
    status_block?: unknown[];
}

export interface PatchEngagementRequest {
    id: number;
    name?: string;
    start_date?: string;
    status_id?: number;
    end_date?: string;
    description?: string;
    rich_description?: string;
    banner_filename?: string;
    status_block?: unknown[];
}
