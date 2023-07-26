export type SubscribeTypeLabel = 'EMAIL_LIST' | 'FORM';

export interface Subscribe {
    engagement_id: number;
    participant_id: number;
    is_subscribed: string;
}

export interface Unsubscribe {
    participant_id: number;
    is_subscribed: string;
}

export const Subscribe_TYPE: { [x: string]: SubscribeTypeLabel } = {
    EMAIL_LIST: 'EMAIL_LIST',
    FORM: 'FORM',
};

export interface SubscribeForm {
    widget_id: number;
    title?: string;
    description?: string;
    call_to_action_type?: string;
    call_to_action_text?: string;
    form_type: SubscribeTypeLabel;
}
