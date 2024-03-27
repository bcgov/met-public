export type EngagementContentTypes = 'Summary' | 'Custom';

export const CONTENT_TYPE: { [status: string]: EngagementContentTypes } = {
    SUMMARY: 'Summary',
    CUSTOM: 'Custom',
};

export interface EngagementContent {
    id: number;
    title: string;
    icon_name: string;
    content_type: string;
    engagement_id: number;
    sort_index: number;
    is_internal: boolean;
}

export const createDefaultEngagementContent = (): EngagementContent => {
    return {
        id: 0,
        title: 'Summary',
        icon_name: '',
        content_type: CONTENT_TYPE.SUMMARY,
        engagement_id: 0,
        sort_index: 1,
        is_internal: false,
    };
};
