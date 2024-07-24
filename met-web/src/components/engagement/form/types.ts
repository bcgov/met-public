import React from 'react';
import { Engagement, EngagementMetadata, MetadataTaxon } from '../../../models/engagement';
import { EngagementStatusBlock } from '../../../models/engagementStatusBlock';
import { EngagementContent } from 'models/engagementContent';

export interface EngagementContext {
    handleCreateEngagementRequest: (_engagement: EngagementForm) => Promise<Engagement>;
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate) => Promise<Engagement>;
    setEngagementMetadata: React.Dispatch<React.SetStateAction<EngagementMetadata[]>>;
    taxonMetadata: Map<number, string[]>;
    tenantTaxa: MetadataTaxon[];
    setTenantTaxa: React.Dispatch<React.SetStateAction<MetadataTaxon[]>>;
    isSaving: boolean;
    setSaving: React.Dispatch<React.SetStateAction<boolean>>;
    savedEngagement: Engagement;
    engagementMetadata: EngagementMetadata[];
    engagementId: string | undefined;
    handleAddBannerImage: (_files: File[]) => void;
    loadingAuthorization: boolean;
    isNewEngagement: boolean;
    setIsNewEngagement: React.Dispatch<React.SetStateAction<boolean>>;
    contentTabs: EngagementContent[];
    setContentTabs: React.Dispatch<React.SetStateAction<EngagementContent[]>>;
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
    sponsor_name: string;
    cta_message: string;
    cta_url: string;
}

export interface EngagementFormUpdate {
    name?: string;
    description?: string;
    rich_description?: string;
    start_date?: string;
    end_date?: string;
    is_internal?: boolean;
    status_block?: EngagementStatusBlock[];
    consent_message?: string;
    sponsor_name?: string;
    cta_message?: string;
    cta_url?: string;
}

export type EngagementParams = {
    engagementId: string;
};

export type OpenModalProps = {
    handleConfirm?: () => void;
};
