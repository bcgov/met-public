import { Engagement } from '../../../models/engagement';

export interface EngagementContext {
    handleCreateEngagementRequest: (_engagement: EngagementForm) => Promise<Engagement>;
    handleUpdateEngagementRequest: (_engagement: EngagementForm) => Promise<Engagement>;
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

export type EngagementFormModalState = {
    modalOpen: boolean;
    handleConfirm?: () => void;
};

export type OpenModalProps = {
    handleConfirm?: () => void;
};
