export interface CreateSubscription {
    engagement_id: number;
    email_address: string;
    is_subscribed: string;
    participant_id: number;
    project_id: string;
    type: string;
}

export interface Subscribe {
    engagement_id: number;
    participant_id: number;
    is_subscribed: string;
}

export interface Unsubscribe {
    participant_id: number;
    is_subscribed: string;
}
