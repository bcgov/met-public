export type SubscribeTypeLabel = 'EMAIL_LIST' | 'SIGN_UP';

export type CallToActionTypes = 'link' | 'button';

export interface Subscription {
    engagement_id: number;
    email_address: string;
    is_subscribed: boolean;
    participant_id: number;
    type: string;
}

export interface Subscribe {
    engagement_id: number;
    participant_id: number;
    is_subscribed: boolean;
}

export interface Unsubscribe {
    participant_id: number;
    is_subscribed: boolean;
}

export const SUBSCRIBE_TYPE: { [x in SubscribeTypeLabel]: SubscribeTypeLabel } = {
    EMAIL_LIST: 'EMAIL_LIST',
    SIGN_UP: 'SIGN_UP',
};

export const CallToActionType: { [x: string]: CallToActionTypes } = {
    LINK: 'link',
    BUTTON: 'button',
};

export interface SubscribeForm {
    id: number;
    title: string;
    type: SubscribeTypeLabel;
    sort_index: number;
    widget_id: number;
    created_date: string;
    updated_date: string;
    subscribe_items: SubscribeFormItem[];
}

export interface SubscribeFormItem {
    id: number;
    title?: string;
    description: string;
    rich_description: string;
    call_to_action_type: 'link' | 'button';
    call_to_action_text: string;
    form_type: SubscribeTypeLabel;
    created_date: string;
    updated_date: string;
    widget_subscribe: number;
}
