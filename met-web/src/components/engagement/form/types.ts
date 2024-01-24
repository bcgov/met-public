import { Engagement, EngagementMetadata } from '../../../models/engagement';
import { EngagementStatusBlock } from '../../../models/engagementStatusBlock';

export interface EngagementContext {
    handleCreateEngagementRequest: (_engagement: EngagementForm) => Promise<Engagement>;
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate) => Promise<Engagement>;
    handleCreateEngagementMetadataRequest: (_engagement: EngagementMetadata) => Promise<EngagementMetadata>;
    handleUpdateEngagementMetadataRequest: (_engagement: EngagementMetadata) => Promise<EngagementMetadata>;
    isSaving: boolean;
    savedEngagement: Engagement;
    engagementMetadata: EngagementMetadata;
    engagementId: string | undefined;
    loadingSavedEngagement: boolean;
    handleAddBannerImage: (_files: File[]) => void;
    fetchEngagement: () => void;
    fetchEngagementMetadata: () => void;
    loadingAuthorization: boolean;
}

export interface Widget {
    id: number;
    widget_type: number;
    engagement_id: number;
    data: unknown;
}

export interface EngagementForm {
    name: string;
    description: string;
    rich_description: string;
    start_date: string;
    end_date: string;
    content: string;
    rich_content: string;
    status_block: EngagementStatusBlock[];
}

export interface EngagementFormUpdate {
    name?: string;
    description?: string;
    rich_description?: string;
    start_date?: string;
    end_date?: string;
    content?: string;
    rich_content?: string;
    is_internal?: boolean;
    status_block?: EngagementStatusBlock[];
    consent_message?: string;
}

export type EngagementParams = {
    engagementId: string;
};

export type OpenModalProps = {
    handleConfirm?: () => void;
};
