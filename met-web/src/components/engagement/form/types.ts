import { Engagement } from '../../../models/engagement';

export interface EngagementContext {
    handleCreateEngagementRequest: (_engagement: EngagementForm) => void;
    handleUpdateEngagementRequest: (_engagement: EngagementForm) => void;
    saving: boolean;
    savedEngagement: Engagement;
    engagementId: string | undefined;
    loadingSavedEngagement: boolean;
    handleAddBannerImage: (_files: File[]) => void;
}

export interface EngagementForm {
    name: string;
    description: string;
    richDescription: string;
    status_id: number;
    fromDate: string;
    toDate: string;
    content: string;
    richContent: string;
    status: object;
}

export type EngagementParams = {
    engagementId: string;
};
