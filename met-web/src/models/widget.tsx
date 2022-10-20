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

export enum WidgetType {
    WhoIsListening = 1,
}
