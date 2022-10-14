import { WidgetsList } from 'models/widget';
import { Engagement } from '../../../models/engagement';

export interface EngagementContext {
    handleCreateEngagementRequest: (_engagement: EngagementForm) => Promise<Engagement>;
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate) => Promise<Engagement>;
    isSaving: boolean;
    savedEngagement: Engagement;
    engagementId: string | undefined;
    loadingSavedEngagement: boolean;
    handleAddBannerImage: (_files: File[]) => void;
    fetchEngagement: () => void;
    widgets: WidgetsList[];
    widgetDrawerOpen: boolean;
    handleWidgetDrawerOpen: (_open: boolean) => void;
    widgetDrawerTabValue: string;
    handleWidgetDrawerTabValueChange: (_tabValue: string) => void;
    addContactDrawerOpen: boolean;
    handleAddContactDrawerOpen: (_open: boolean) => void;
    isWidgetsLoading: boolean;
}

export interface EngagementForm {
    name: string;
    description: string;
    rich_description: string;
    start_date: string;
    end_date: string;
    content: string;
    rich_content: string;
}

export interface EngagementFormUpdate {
    name?: string;
    description?: string;
    rich_description?: string;
    start_date?: string;
    end_date?: string;
    content?: string;
    rich_content?: string;
}

export type EngagementParams = {
    engagementId: string;
};

export type OpenModalProps = {
    handleConfirm?: () => void;
};
