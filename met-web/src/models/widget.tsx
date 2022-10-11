export interface Widget {
    id: number;
    widget_type: number;
    engagement_id: number;
    data: unknown;
}

export interface WidgetsList {
    widget_type: number;
    items: Widget[];
}

export interface WidgetContact {
    id: number;
    name: string;
    role: string;
    phoneNumber: string;
    email: string;
    address: string;
    bio: string;
}
