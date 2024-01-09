export interface TimelineWidget {
    id: number;
    engagement_id: number;
    widget_id: number;
    title: string;
    description: string;
    events: TimelineEvent[];
}

export interface TimelineEvent {
    id: number;
    engagement_id: number;
    widget_id: number;
    timeline_id: number;
    description: string;
    time: string;
    status: EventStatus;
    position: number;
}

export enum EventStatus {
    Pending = 1,
    InProgress = 2,
    Completed = 3,
}
