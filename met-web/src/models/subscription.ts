export interface Subscribe {
    email_verification_id: number;
    user_id: number;
    is_subscribed: string;
}

export interface Unsubscribe {
    user_id: number;
    is_subscribed: string;
}
