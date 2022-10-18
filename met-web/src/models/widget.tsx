export interface Widget {
    id: number;
    widget_type: number;
    engagement_id: number;
    data: unknown;
}

export interface WidgetsList {
    id: number;
    widget_type_id: number;
    items: Widget[];
}

export interface WidgetContact {
    id: number;
    name: string;
    role: string;
    phone_number: string;
    email: string;
    address: string;
    bio: string;
}

export enum WidgetType {
    WhoIsListening = 1,
}
