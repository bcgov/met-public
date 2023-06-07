export interface Subscribe {
    engagement_id: number;
    participant_id: number;
    is_subscribed: string;
}

export interface Unsubscribe {
    participant_id: number;
    is_subscribed: string;
}
