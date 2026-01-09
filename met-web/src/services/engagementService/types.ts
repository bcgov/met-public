import { Engagement } from 'models/engagement';
import { EngagementStatusBlock } from 'models/engagementStatusBlock';

export interface EngagementState {
    allEngagements: Engagement[];
}

export interface PostEngagementRequest {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    rich_description: string;
    description_title: string;
    banner_filename?: string;
    status_block?: EngagementStatusBlock[];
    is_internal?: boolean;
}

export interface PutEngagementRequest {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    rich_description: string;
    description_title: string;
    banner_filename?: string;
    status_block?: EngagementStatusBlock[];
    sponsor_name?: string;
}

export interface PatchEngagementRequest {
    id: number;
    name?: string;
    start_date?: string;
    end_date?: string;
    status_id?: number;
    scheduled_date?: string;
    description?: string;
    rich_description?: string;
    description_title?: string;
    banner_filename?: string;
    status_block?: EngagementStatusBlock[];
    is_internal?: boolean;
    sponsor_name?: string;
}
