import { Engagement } from '../../../models/engagement';

export interface EngagementContext {
    handleCreateEngagementRequest: (_engagement: IEngagementForm) => Promise<Engagement>;
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate) => Promise<Engagement>;
    isSaving: boolean;
    savedEngagement: Engagement;
    engagementId: string | undefined;
    loadingSavedEngagement: boolean;
    handleAddBannerImage: (_files: File[]) => void;
    fetchEngagement: () => void;
    modalState: EngagementFormModalState;
    handleOpenModal: (props: OpenModalProps) => void;
    handleCloseModal: () => void;
}

export interface IEngagementForm {
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

export type EngagementFormModalState = {
    modalOpen: boolean;
    handleConfirm?: () => void;
};

export type OpenModalProps = {
    handleConfirm?: () => void;
};
