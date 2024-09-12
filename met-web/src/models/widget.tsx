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
    location: WidgetLocation;
}

export enum WidgetType {
    WhoIsListening = 1,
    Document = 2,
    Subscribe = 4,
    Events = 5,
    Map = 6,
    Video = 7,
    CACForm = 8,
    Timeline = 9,
    Poll = 10,
}

export enum WidgetLocation {
    Summary = 1,
    Details = 2,
    Feedback = 3,
}
