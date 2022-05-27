interface EngagementState {
    allEngagements: Engagement[];
}

interface PostEngagementRequest {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    rich_description: string;
}

interface PutEngagementRequest {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    rich_description: string;
}
