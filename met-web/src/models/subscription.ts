export interface Subscribe {
    engagement_id: number;
    user_id: number;
    is_subscribed: string;
}

export interface Unsubscribe {
    user_id: number;
    is_subscribed: string;
}
