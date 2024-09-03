export interface EngagementContent {
    id: number;
    title: string;
    text_content: string;
    json_content: string;
    engagement_id: number;
    sort_index: number;
    is_internal: boolean;
}

export const createDefaultEngagementContent = (): EngagementContent => {
    return {
        id: 0,
        title: 'Summary',
        text_content: '',
        json_content: '{}',
        engagement_id: 0,
        sort_index: 1,
        is_internal: false,
    };
};
