interface EngagementContext {
    handleCreateEngagementRequest: Function;
    handleUpdateEngagementRequest: Function;
    saving: boolean;
    savedEngagement: Engagement;
    engagementId: string | undefined;
}

interface EngagementForm {
    name: string;
    description: string;
    richDescription: string;
    status_id: string;
    fromDate: string;
    toDate: string;
}

type EngagementParams = {
    engagementId: string;
};
