export interface WidgetItem {
    id: number;
    widget_id: number;
    widget_data_id: number;
    sort_index: number;
}

export interface Widget {
    id: number;
    widget_type_id: WidgetType;
    engagement_id: number;
    items: WidgetItem[];
    title: string;
}

export enum WidgetType {
    WhoIsListening = 1,
    Document = 2,
    Phases = 3,
    Subscribe = 4,
    Events = 5,
    Map = 6,
    Video = 7,
    CACForm = 8,
    Timeline = 9,
    Poll = 10,
}
